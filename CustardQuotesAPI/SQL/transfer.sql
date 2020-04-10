DROP TABLE CustardQuotes;

CREATE TABLE CustardQuotes (
   ID int IDENTITY(1,1) NOT NULL,
   Quote VARCHAR(2000) NOT NULL,
   Person VARCHAR(30) NOT NULL,
   Author VARCHAR(30),
   DateAdded Date,
   Source VARCHAR(30)
   PRIMARY KEY (ID)
);

INSERT INTO dbo.CustardQuotes (ID, Quote, Person, Author, DateAdded, Source)
    SELECT ID, Quote, Person, Author, DateAdded, Source
    FROM dbo.quotes
	ORDER by DateAdded;