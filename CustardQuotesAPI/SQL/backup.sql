CREATE TABLE _BackupApril11 (
   [ID] int IDENTITY(1,1) NOT NULL,
   [Quote] VARCHAR(2000) NOT NULL,
   [Person] VARCHAR(30) NOT NULL,
   [Author] VARCHAR(50),
   [DateAdded] Date,
   [Source] VARCHAR(30),
   [GroupID] int,
   PRIMARY KEY (ID)
);

INSERT INTO dbo._BackupApril11(Quote, Person, Author, DateAdded, Source, GroupID)
    SELECT Quote, Person, Author, DateAdded, Source, GroupID
    FROM dbo.CustardQuotes
    ORDER by ID;