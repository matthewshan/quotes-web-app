CREATE TABLE Groups (
   [GroupID] int IDENTITY(1,1) NOT NULL,
   [Name] varchar(50),
   [Owner] varchar(50),
   [DiscordServer] varchar(50),
   PRIMARY KEY ([GroupID])
);

CREATE TABLE CustardQuotes (
   [ID] int IDENTITY(1,1) NOT NULL,
   [Quote] VARCHAR(2000) NOT NULL,
   [Person] VARCHAR(30) NOT NULL,
   [Author] VARCHAR(30),
   [DateAdded] Date,
   [Source] VARCHAR(30),
   [GroupID] int,
   PRIMARY KEY (ID),
   FOREIGN KEY (GroupID) REFERENCES Groups(GroupID)
);