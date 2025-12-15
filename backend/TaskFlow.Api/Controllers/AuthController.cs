using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Api.Auth;
using TaskFlow.Api.Data;
using TaskFlow.Api.DTOs;
using TaskFlow.Api.Models;

namespace TaskFlow.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly PasswordService _passwordService;
    private readonly TokenService _tokenService;

    public AuthController(AppDbContext db, PasswordService passwordService, TokenService tokenService)
    {
        _db = db;
        _passwordService = passwordService;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var emailExists = await _db.Users.AnyAsync(u => u.Email == dto.Email);
        if (emailExists)
        {
            return BadRequest(new { message = "Email already registered" });
        }
        var passwordHash = _passwordService.HashPassword(dto.Password);
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = dto.Email,
            PasswordHash = passwordHash
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        var token = _tokenService.CreateAccessToken(user);
        return Ok(new { token });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null)
        {
            return Unauthorized(new { message = "Login credentials are invalid." });
        }
        var correctPassword = _passwordService.VerifyPassword(dto.Password, user.PasswordHash);
        if (!correctPassword)
        {
            return Unauthorized(new { message = "Login credentials are invalid." }); 
        }
        var token = _tokenService.CreateAccessToken(user);
        return Ok(new { token });
    }
}