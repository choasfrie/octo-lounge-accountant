using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace octo_lounge_accountant_api.Migrations
{
    /// <inheritdoc />
    public partial class Behaviours : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AccountBehaviour",
                table: "Accounts",
                type: "nvarchar(1)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AccountBehaviour",
                table: "Accounts");
        }
    }
}
