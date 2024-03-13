-- Active: 1710312253657@@127.0.0.1@3306@kwebhw242nd

CREATE TABLE courses (
    title VARCHAR(255) NOT NULL,
    course_number VARCHAR(45) NOT NULL,
	prof VARCHAR(45) NOT NULL,
    memo TEXT,
    PRIMARY KEY (course_number)
);


INSERT INTO courses (title, course_number, prof, memo)
VALUES
('컴퓨터그래픽스', 'COSE331', 'BAB', 'OpenGL을 이용하여 3차원 그래픽스 이론을 이해하고 프로그래밍 실습함'),
('운영체제', 'COSE341', 'BAB', '운영체제 수업입니다.'),
('컴퓨터네트워크', 'COSE342', 'BAB', '유선 네트워크, 인터넷 아키텍처 및 관련 프로토콜, 네트워크 프로그래밍에 대한 지식 학습.'),
('데이터베이스', 'COSE371', '진구', '데이터베이스에 대한 개념, 모델, 언어 및 응용에 대하여 공부합니다.'),
('확률과랜덤과정', 'COSE382', '진구', '확률에 대한 기본 개념을 복습하고 변환하는 과정에 대해서 알아본다.'),
('Computer Science 101', 'CS101', 'Dr. Smith', 'Introduction to computer science.'),
('History 101', 'HIST101', 'Dr. Lee', 'Survey of world history from ancient civilizations to modern times.'),
('해킹과보안', 'ITCS302', '퉁퉁이', '해킹과 보안 수업입니다.'),
('Mathematics 201', 'MATH201', 'Prof. Johnson', 'Advanced mathematics course for undergraduates.'),
('해석학1및연습', 'MATH211', 'BAB', 'introduction to mathematical analysis'),
('회귀분석', 'MATH304', 'BAB', '회귀분석,,,,');



CREATE TABLE member (
    user_id VARCHAR(45) NULL,
    pw VARCHAR(200) NULL,
    name VARCHAR(15) NULL,
	user_number VARCHAR(45) NULL,
    role ENUM('professor', 'student') NOT NULL,
    PRIMARY KEY (user_number)
);


INSERT INTO member (user_id, pw, name, user_number, role)
VALUES
('prof1', 'prof1pw', 'BAB', 20123, 'professor'),
('prof2', 'prof2pw', '진구', 204098, 'professor'),
('stud1', 'stud1pw', 'steven', 23142, 'student'),
('stud3', 'stud3pw', '이슬이', 23452, 'student'),
('stud2', 'stud2pw', '프로이트', 408266, 'student'),
('prof3', 'prof3pw', '퉁퉁이', 423563, 'professor');



CREATE TABLE notice (
    idx INT NOT NULL AUTO_INCREMENT,
    course_number VARCHAR(45) NOT NULL,
title VARCHAR(45) NOT NULL,
    memo TEXT,
    PRIMARY KEY (idx),
    FOREIGN KEY (course_number) REFERENCES courses(course_number)
);



INSERT INTO notice (course_number, title, memo)
VALUES
('CS101', '공지1', 'CS101 수업의 공지사항입니다.'),
('MATH201', '시간', 'MATH201 수업은 2교시입니다.'),
('COSE331', 'hi', '안녕하세요.'),
('MATH211', '강의실', '강의실은 이학관 301호 입니다.'),
('COSE331', '교재', '교재는 따로 없고 ppt가 제공됩니다.'),
('MATH211', '3/8 휴강', '학회 출장으로 인하여 3/8일 강의는 휴강입니다. 보강은 따로 공지하도록 하겠습니다.'),
('COSE371', '주의', '01분반과 02분반이 배우는 내용이 다르니 강의 계획서를 참고하세요.'),
('COSE341', '강의실', '강의실은 정보관 202호입니다.'),
('COSE331', '휴강', '3/12 교수 개인사정으로 휴강입니다.'),
('COSE382', '강의실', '강의실은 과도관 511호입니다.');



CREATE TABLE studentcourse (
    user_number VARCHAR(45) NOT NULL,
    course_number VARCHAR(45) NOT NULL,
    CONSTRAINT studentcourse_pk PRIMARY KEY (user_number, course_number),
    FOREIGN KEY (user_number) REFERENCES member(user_number),
    FOREIGN KEY (course_number) REFERENCES courses(course_number)
);


INSERT INTO studentcourse (user_number, course_number)
VALUES
(23142, 'COSE331'),
(23452, 'COSE341'),
(23452, 'COSE382'),
(23452, 'CS101'),
(408266, 'CS101'),
(23142, 'HIST101'),
(23142, 'ITCS302'),
(408266, 'MATH211'),
(23142, 'MATH304');

