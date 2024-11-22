using Microsoft.EntityFrameworkCore;
using TestApplication.Models;

namespace TestApplication
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Table> Tables { get; set; }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Table>()
                .HasMany(t => t.Columns)       
                .WithOne(c => c.Table)         
                .HasForeignKey(c => c.TableId);

            modelBuilder.Entity<Row>()
                .HasMany(r => r.Values)
                .WithOne(v => v.Row)
                .HasForeignKey(v => v.RowId);

            modelBuilder.Entity<ColumnInfo>()
            .ToTable("ColumnInfos");

            modelBuilder.Entity<ExternalCollection>()
                .ToTable("ExternalCollections");

            modelBuilder.Entity<RegexColumn>()
                .ToTable("RegexColumns");

            modelBuilder.Entity<ExternalCollection>()
                .HasBaseType<ColumnInfo>();

            modelBuilder.Entity<RegexColumn>()
                .HasBaseType<ColumnInfo>();
        }

    }
}
