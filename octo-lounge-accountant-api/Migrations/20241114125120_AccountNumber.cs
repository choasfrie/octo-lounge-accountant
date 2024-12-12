using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace octo_lounge_accountant_api.Migrations
{
    /// <inheritdoc />
    public partial class AccountNumber : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AccountNumber",
                table: "Accounts",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AccountNumber",
                table: "Accounts");
        }
    }
}
