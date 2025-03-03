CREATE DATABASE bookswap;
USE bookswap;

CREATE TABLE Uzytkownik (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    haslo VARCHAR(255) NOT NULL,
    imie VARCHAR(100) NOT NULL,
    data_urodzenia DATE NOT NULL,
    rola ENUM('zalogowany', 'administrator', 'bibliotekarz') DEFAULT 'zalogowany'
);

CREATE TABLE Ksiazka (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tytul VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    ISBN VARCHAR(20),
    data_wydania DATE,
    wydawnictwo VARCHAR(100),
    gatunek VARCHAR(50),
    jezyk VARCHAR(50),
    liczba_stron INT,
    zdjecie_okladki VARCHAR(255),
    data_dodania DATE,
    status ENUM('dostępna', 'zarezerwowana', 'niedostępna') DEFAULT 'dostępna',
    uzytkownik_id INT,
    FOREIGN KEY (uzytkownik_id) REFERENCES Uzytkownik(id) ON DELETE CASCADE
);

CREATE TABLE Wymiana (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data_dodania DATE NOT NULL,
    data_dokonania DATE NULL,
    status ENUM('oczekuje', 'zaakceptowana', 'odrzucona', 'zakończona') DEFAULT 'oczekuje'
);

CREATE TABLE Ksiazka_Wymiana (
	id INT AUTO_INCREMENT PRIMARY KEY,
    wymiana_id INT,
    ksiazka_id INT,
    komentarz VARCHAR(255) NULL,
    uzytkownik_id INT,
    ocena INT CHECK (ocena >= 0 AND ocena <= 5) NULL,
    zakonczyl BOOLEAN DEFAULT false,
    FOREIGN KEY (wymiana_id) REFERENCES Wymiana(id) ON DELETE CASCADE,
    FOREIGN KEY (ksiazka_id) REFERENCES Ksiazka(id) ON DELETE CASCADE,
    FOREIGN KEY (uzytkownik_id) REFERENCES Uzytkownik(id) ON DELETE CASCADE
);

CREATE TABLE Lista_zyczen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ksiazka_id INT,
    uzytkownik_id INT,
    data_dodania DATE,
    FOREIGN KEY (ksiazka_id) REFERENCES Ksiazka(id) ON DELETE CASCADE,
    FOREIGN KEY (uzytkownik_id) REFERENCES Uzytkownik(id) ON DELETE CASCADE
);