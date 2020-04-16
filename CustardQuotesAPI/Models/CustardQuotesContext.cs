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
        public virtual DbSet<GroupsModel> Groups { get; set; }

        public virtual DbSet<UserGroupsModel> UserGroups { get; set; }

        public virtual DbSet<UsersModel> Users { get; set; }
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

            modelBuilder.Entity<GroupsModel>(entity =>
            {
                entity.HasKey(e => e.GroupId)
                    .HasName("PK_Group");

                entity.Property(e => e.GroupId)
                    .HasColumnName("GroupID")
                    .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn); ;

                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Owner)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.DiscordServer)
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<UserGroupsModel>().ToTable("UserGroups").HasKey(c => new { c.UserId, c.GroupId});
            modelBuilder.Entity<UsersModel>().ToTable("Users");

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
