var express = require('express');
var bodyParser=require('body-parser');
var app = express();
const ejs=require('ejs')
var session = require('express-session');

//mysql연결
const db = require('./config/mysql.js');
const connection = db.init();
db.connect(connection);

//set
app.set('view engine', 'ejs');
app.set('views','./views');

//use
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret: 'fadsfasd', cookie: {maxAge : 60000 }, resave:true, saveUninitialized:true}))

//get
//기본화면 -> login or signup
app.get('/', function(req,res){
    res.render('main')
})

//교수
app.get('/professor', function(req,res){
    res.render('professor')
})

app.get('/pro_courses', (req,res) => {
    var sql='select * from courses'
    connection.query(sql, function(err,results,fields){
        if(err) throw err;
        res.render('pro_courses', {lists:results});
    })
})

app.get('/coursesDelete', (req,res) => {
    var course_number=req.query.course_number
    var sql = `delete from courses where course_number='${course_number}'`

    connection.query(sql,function(err,result){
        if(err) throw err;
        console.log('삭제.');
        res.send("<script> alert('삭제되었습니다.'); location.href='/pro_courses';</script>");
    })
})

app.get('/pro_pluscourses', function(req, res){
    const prof = req.session.prof;
    res.render('pro_pluscourses', { prof: prof });
});



app.post('/pluscoursesProc', (req,res) => {
    const course_number=req.body.course_number;
    const title=req.body.title;
    const memo=req.body.memo;
    const prof=req.session.prof;

    var sql=`insert into courses(course_number,title,prof,memo)
    values(?,?,?,?)`
    
    var values=[course_number,title,prof,memo];

    connection.query(sql,values,function(err,result){
        if(err) throw err;
        console.log('강의 추가');
        res.send("<script> alert('강의가 추가 되었습니다.'); location.href='/pro_courses';</script>");
    })

})


app.get('/pro_mycourses', (req, res) => {
    const prof = req.session.prof;

    if (prof) {
        const sql = 'SELECT * FROM courses WHERE prof = ?';
        
        connection.query(sql, [prof], (err, results) => {
            if (err) {
                console.error('코스를 가져오는 과정에서 오류 발생:', err);
                res.send('코스를 가져오는 과정에서 오류 발생.');
            } else {
                res.render('pro_mycourses', { courses: results });
            }
        });
    } else {
        res.send('교수 정보가 만료되었습니다. 다시 로그인해주세요.');
    }
});

app.get('/pro_plusnote', function(req, res) {
    const course_number = req.query.course_number;
    const course = {
        course_number: course_number,
    };
    
    res.render('pro_plusnote', { course: course });
});

app.post('/pro_plusnote', function(req, res) {
    const course_number = req.body.course_number;
    const title = req.body.title;
    const memo = req.body.memo;

    res.render('pro_plusnote', { course: { course_number: course_number } });
});


app.post('/plusnoteProc', (req,res) => {
    const course_number=req.body.course_number;
    const title=req.body.title;
    const memo=req.body.memo;

    var sql=`insert into notice(course_number,title,memo)
    values(?,?,?)`
    
    var values=[course_number,title,memo];

    connection.query(sql,values,function(err,result){
        if(err) throw err;
        console.log('공지 추가.');
        //res.send("<script> alert('공지가 추가 되었습니다.'); location.href='/pro_courses_outline';</script>");
        res.send(`<script> alert('공지가 추가 되었습니다.'); location.href='/pro_courses_outline?course_number=${course_number}';</script>`);
        //전달할때 coursr_number을 같이 주면 되는거였음! 해결!!!!!!!!
    })

})

app.get('/pro_courses_outline', (req, res) => {
    const course_number = req.query.course_number;

    //console.log('course_number:', course_number); //출력

    const courseSql = 'SELECT * FROM courses WHERE course_number = ?';
    connection.query(courseSql, [course_number], (err, courseResult) => {
        if (err) {
            console.error('수업 세부 정보를 가져오는 과정에서 오류 발생:', err);
            return res.status(500).send('수업 세부 정보를 가져오는 과정에서 오류 발생');
        }

        //console.log('courseResult:', courseResult); // 출력

        if (courseResult.length === 0) {
            return res.status(404).send('수업이 존재하지 않습니다.');
        }

        const noticeSql = 'SELECT * FROM notice WHERE course_number = ?';
        connection.query(noticeSql, [course_number], (err, noticeResult) => {
            if (err) {
                console.error('공지사항을 가져오는 과정에서 오류 발생:', err);
                return res.status(500).send('공지사항을 가져오는 과정에서 오류 발생');
            }

            res.render('pro_courses_outline', { course: courseResult[0], notices: noticeResult });
        });
    });
});


app.get('/deleteNotice', (req,res) => {
    var idx=req.query.idx
    var sql = `delete from notice where idx='${idx}'`

    connection.query(sql,function(err,result){
        if(err) throw err;
        console.log('삭제.');
        res.send("<script> alert('삭제되었습니다.'); location.href='/pro_courses';</script>");
    })
})



//학생
app.get('/student', function(req,res){
    res.render('student')
})

app.get('/st_courses', function(req,res){
    var sql='select * from courses'
    connection.query(sql, function(err,results,fields){
        if(err) throw err;
        res.render('st_courses', {lists:results});
    })
})


app.get('/putmycourse', (req, res) => {
    const user_number = req.session.user_number;
    const course_number = req.query.course_number; 

    if (user_number) {
        const sql = 'INSERT INTO studentcourse (user_number, course_number) VALUES (?, ?)';
        const values = [user_number, course_number];

        connection.query(sql, values, (err, result) => {
            if (err) {
                console.error('수강신청 실패 : ', err);
                res.send("<script> alert('수강신청 실패했습니다.'); location.href='/st_courses';</script>");
            } else {
                console.log('수강신청 성공');
                res.send("<script> alert('수강신청 되었습니다.'); location.href='/st_courses';</script>");
            }
        });
    } else {
        res.send('User number is required');
    }
});


app.get('/mycourses', (req, res) => {
    const user_number = req.session.user_number;

    if (user_number) {
        const sql = 'SELECT * FROM courses WHERE course_number IN (SELECT course_number FROM studentcourse WHERE user_number = ?)';
        
        connection.query(sql, [user_number], (err, results) => {
            if (err) {
                console.error('Error fetching user courses:', err);
                res.send('Error fetching user courses');
            } else {
                res.render('mycourses', { courses: results });
            }
        });
    } else {
        res.send('User number is required');
    }
});


app.get('/st_courses_outline', (req, res) => {
    const course_number = req.query.course_number;

    const courseSql = 'SELECT * FROM courses WHERE course_number = ?';
    connection.query(courseSql, [course_number], (err, courseResult) => {
        if (err) {
            console.error('수업 세부 정보를 가져오는 과정에서 오류 발생:', err);
            return res.status(500).send('수업 세부 정보를 가져오는 과정에서 오류 발생');
        }

        if (courseResult.length === 0) {
            return res.status(404).send('수업이 존재하지 않습니다.');
        }

        const noticeSql = 'SELECT * FROM notice WHERE course_number = ?';
        connection.query(noticeSql, [course_number], (err, noticeResult) => {
            if (err) {
                console.error('공지사항을 가져오는 과정에서 오류 발생:', err);
                return res.status(500).send('공지사항을 가져오는 과정에서 오류 발생');
            }

            res.render('st_courses_outline', { course: courseResult[0], notices: noticeResult });
        });
    });
});



//로그인
app.get('/login', (req,res) => {
    res.render('login')
})

app.post('/loginProc', (req, res) => {
    const user_id = req.body.user_id;
    const pw = req.body.pw;
    const myrole = req.body.role;

    var sql = 'SELECT * FROM member WHERE user_id=? AND pw=?';

    var values = [user_id, pw];

    connection.query(sql, values, function (err, result) {
        if (err) throw err;

        if (result.length == 0) {
            res.send("<script> alert('로그인 오류입니다. 다시 시도해주세요.'); location.href='/login';</script>");
        } else {
            req.session.member = result[0];
            req.session.user_number = result[0].user_number;

            // 교수
            if (result[0].role == 'professor') {
                req.session.prof = result[0].name;
                console.log(result[0]);
                res.send("<script> alert('교수 로그인 되었습니다.'); location.href='/professor';</script>");
            } 
            // 학생
            else {
                console.log(result[0]);
                res.send("<script> alert('학생 로그인 되었습니다.'); location.href='/student';</script>");
            }
        }
    });
});


//회원가입
app.get('/signup', (req,res) => {
    res.render('signup')
})


app.post('/signupProc', (req, res) => {
    const user_id = req.body.user_id;
    const pw = req.body.pw;
    const name = req.body.name;
    const user_number = req.body.user_number;
    const myrole = req.body.role;

    const checkDuplicateQuery = 'SELECT * FROM member WHERE user_id = ? OR user_number = ?';
    const checkDuplicateValues = [user_id, user_number];

    connection.query(checkDuplicateQuery, checkDuplicateValues, (err, rows) => {
        if (err) {
            console.error('회원가입 과정 중 오류 발생:', err);
            return res.status(500).send('회원가입 중 오류가 발생했습니다.');
        }

        if (rows.length > 0) {
            return res.status(400).send('이미 등록된 아이디 또는 학번입니다.');
        } else {
            const insertQuery = 'INSERT INTO member (user_id, pw, name, user_number, role) VALUES (?, ?, ?, ?, ?)';
            const insertValues = [user_id, pw, name, user_number, myrole];

            connection.query(insertQuery, insertValues, (err, result) => {
                if (err) {
                    console.error('회원가입 처리 중 오류 발생:', err);
                    return res.status(500).send('회원가입 중 오류가 발생했습니다.');
                }

                res.send("<script> alert('회원가입 되었습니다. 로그인해주세요.'); location.href='/';</script>");
            });
        }
    });
});



app.listen(3000, function(){
    console.log('Connected, 3000-port!');
})
