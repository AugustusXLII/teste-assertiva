CREATE DATABASE assertiva;
\c assertiva;

CREATE TABLE Clientes (
    ID SERIAL PRIMARY KEY,
    CPF VARCHAR(11) UNIQUE,
    Nome VARCHAR(255)
);

CREATE TABLE Telefones (
    ID SERIAL PRIMARY KEY,
    ClienteID INT REFERENCES Clientes(ID),
    Numero VARCHAR(11)
);

CREATE TABLE Emails (
    ID SERIAL PRIMARY KEY,
    ClienteID INT REFERENCES Clientes(ID),
    Endereco VARCHAR(255)
);