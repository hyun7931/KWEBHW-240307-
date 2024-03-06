# 케이웹 면제과제 제출입니다.

#깃헙에 제대로 안올라갔을지도 몰라서 zip파일도 함께 제출합니다.
#구글 드라이브 링크는 화면 녹화 영상입니다.

db이름 -> 강의 : courses | 강의별 게시물 : notice | 학생이 수강신청한 강의 : studentcourse

교수가 강의 삭제 할 때 오류
notice테이블과 studentcourse(학생 수강신청)테이블 모두 courses테이블을 참조하기 때문에 notice테이블과 studentcourse테이블에서 먼저 삭제를 하고 나서야 courses에서 수업을 삭제할 수 있습니다
