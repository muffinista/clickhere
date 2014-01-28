DROP TABLE IF EXISTS points;
CREATE TABLE points (
       id INT NOT NULL AUTO_INCREMENT,
       x int,
       y int,
       z int,
       vx decimal(9, 8),
       vy decimal(9, 8),
       mag decimal(9, 3),
       ip varchar(20) not null,
       created_at DATETIME NOT NULL,
       PRIMARY KEY(id)
);
