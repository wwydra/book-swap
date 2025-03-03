INSERT INTO Uzytkownik (email, haslo, imie, data_urodzenia, rola) VALUES
('jan.kowalski@example.com', 'haslo123', 'Jan Kowalski', '1985-05-15', 'administrator'),
('anna.nowak@example.com', 'haslo456', 'Anna Nowak', '1990-09-22', 'zalogowany'),
('pawel.zielinski@example.com', 'haslo789', 'Paweł Zielinski', '1992-12-05', 'bibliotekarz'),
('karolina.wozniak@example.com', 'haslo321', 'Karolina Woźniak', '1993-03-18', 'zalogowany'),
('michal.krawczyk@example.com', 'haslo654', 'Michał Krawczyk', '1988-11-09', 'bibliotekarz'),
('monika.jablonska@example.com', 'haslo987', 'Monika Jabłońska', '1995-07-27', 'administrator'),
('mateusz.lewandowski@example.com', 'hasloabc', 'Mateusz Lewandowski', '1991-04-10', 'zalogowany'),
('aleksandra.dabrowska@example.com', 'hasloxyz', 'Aleksandra Dąbrowska', '1989-06-15', 'bibliotekarz');

INSERT INTO Ksiazka (tytul, autor, ISBN, data_wydania, wydawnictwo, gatunek, jezyk, liczba_stron, zdjecie_okladki, data_dodania, status, uzytkownik_id) VALUES
('Łuk triumfalny', 'Erich Maria Remarque', '9788381886239', '2020-01-01', 'Rebis', 'Literatura piękna', 'polski', 496, 'https://covers.openlibrary.org/b/id/12740652-M.jpg', '2025-01-01', 'zarezerwowana', 2),
('Gdy leżę, konając', 'William Faulkner', '9788324083367', '2024-03-25', 'Znak', 'Literatura piękna', 'polski', 320, 'https://covers.openlibrary.org/b/id/14640322-M.jpg', '2025-01-02', 'dostępna', 2),
('Rozjemca', 'Brandon Sanderson', '9788374806701', '2016-10-26', 'Mag', 'Fantasy, science fiction', 'polski', 672, 'https://covers.openlibrary.org/b/id/12854425-M.jpg', '2024-12-25', 'zarezerwowana', 3),
('Problem trzech ciał', 'Cixin Liu', '9788381881548', '2017-03-14', 'Rebis', 'Fantasy, science fiction', 'polski', 452, 'https://covers.openlibrary.org/b/id/8136574-M.jpg', '2025-01-04', 'dostępna', 3),
('Ręka mistrza', 'Stephen King', '9788376480459', '2008-09-18', 'Prószyński i S-ka', 'Horror', 'polski', 640, 'https://covers.openlibrary.org/b/id/14657147-M.jpg', '2024-10-24', 'dostępna', 4),
('Kolej podziemna', 'Colson Whitehead', '9788381250610', '2017-06-14', 'Albatros', 'Powieść historyczna', 'polski', 384, 'https://covers.openlibrary.org/b/id/10578939-M.jpg', '2024-10-24', 'dostępna', 4),
('Pianie kogutów, płacz psów', 'Wojciech Tochman', '9788308068311', '2019-02-26', 'Literackie', 'Reportaż', 'polski', 224, 'https://covers.openlibrary.org/b/id/10885116-M.jpg', '2024-10-24', 'dostępna', 4),
('Schodów się nie pali', 'Wojciech Tochman', '9788308068632', '2019-05-01', 'Literackie', 'Reportaż', 'polski', 292, 'https://covers.openlibrary.org/b/id/9255145-M.jpg', '2024-10-24', 'dostępna', 4),
('Niespokojny duch', 'Daphne du Maurier', '9788367759380', '2024-05-15', 'Albatros', 'Literatura obyczajowa, romans', 'polski', 448, 'https://covers.openlibrary.org/b/id/14638923-M.jpg', '2024-12-15', 'dostępna', 5),
('Rzeźnia numer pięć', 'Kurt Vonnegut', '9788381164924', '2018-11-12', 'Zysk i S-ka', 'Literatura piękna', 'polski', 240, 'https://covers.openlibrary.org/b/id/8291102-M.jpg', '2024-12-15', 'dostępna', 5),
('Koniec z Eddym', 'Edouard Louis', '9788395352386', '2019-10-07', 'Pauza', 'Literatura piękna', 'polski', 174, 'https://covers.openlibrary.org/b/id/10578935-M.jpg', '2024-12-15', 'dostępna', 5),
('Pierwsza osoba liczby pojedynczej', 'Haruki Murakami', '9788328715264', '2020-11-12', 'Muza', 'Literatura piękna', 'polski', 224, 'https://covers.openlibrary.org/b/id/12706693-M.jpg', '2024-08-19', 'dostępna', 6),
('Ukochane równanie profesora', 'Yōko Ogawa', '9788395243325', '2019-07-07', 'Tajfuny', 'Literatura piękna', 'polski', 192, 'https://covers.openlibrary.org/b/id/10578823-M.jpg', '2024-08-19', 'dostępna', 6),
('Siedem śmierci Evelyn Hardcastle', 'Stuart Turton', '9788382150964', '2020-06-22', 'Albatros', 'Kryminał, sensacja, thriller', 'polski', 512, 'https://covers.openlibrary.org/b/id/9157902-M.jpg', '2024-09-29', 'dostępna', 7);

INSERT INTO Wymiana (data_dodania, data_dokonania, status) VALUES
('2025-01-01', NULL, 'zaakceptowana'),
('2024-12-28', '2025-01-03', 'zakonczona');

INSERT INTO Ksiazka_Wymiana (wymiana_id, ksiazka_id, uzytkownik_id) VALUES
(1, 1, 2),
(1, 3, 3);

INSERT INTO Ksiazka_Wymiana (wymiana_id, ksiazka_id, komentarz, uzytkownik_id, ocena, zakonczyl) VALUES
(2, 2, 'Wszystko w porządku, książka w dobrym stanie', 3, 5, true),
(2, 4, 'Bardzo ciekawa książka, polecam', 2, 4, true);

INSERT INTO Lista_zyczen (ksiazka_id, uzytkownik_id, data_dodania) VALUES
(1, 1, '2025-01-02'),
(3, 1, '2025-01-03');