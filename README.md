# 케이웹 면제과제 제출입니다.

깃헙에 제대로 안올라갔을지도 몰라서 zip파일도 함께 제출합니다.
구글 드라이브 링크는 화면 녹화 영상입니다.

db이름 -> 강의 : courses | 강의별 게시물 : notice | 학생이 수강신청한 강의 : studentcourse

교수가 강의 삭제 할 때 오류
notice테이블과 studentcourse(학생 수강신청)테이블 모두 courses테이블을 참조하기 때문에 notice테이블과 studentcourse테이블에서 먼저 삭제를 하고 나서야 courses에서 수업을 삭제할 수 있습니다

이미 있는 회원목록

교수/학생  |   아이디   |    비밀번호     |    이름

교수           prof1        prof1pw          BAB  

교수           prof2        prof2pw          진구  

교수           prof3        prof3pw          퉁퉁이

학생           stud1        stud1pw          steven

학생           stud2        stud2pw          프로이트

학생           stud3        stud3pw          이슬이

