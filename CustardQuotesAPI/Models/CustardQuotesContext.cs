using System;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace CustardQuotes.Models
{
    public partial class CustardQuotesContext : DbContext
    {
        public CustardQuotesContext(DbContextOptions<CustardQuotesContext> options)
            : base(options)
        {
        }
        public virtual DbSet<CustardQuotesModel> CustardQuotes { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.1")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);
            modelBuilder.Entity<CustardQuotesModel>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                     .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);


                entity.Property(e => e.Author)
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.DateAdded).HasColumnType("date");

                entity.Property(e => e.Person)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.Quote)
                    .IsRequired()
                    .HasMaxLength(2000)
                    .IsUnicode(false);

                entity.Property(e => e.Source)
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.HasKey("Id");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
