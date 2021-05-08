const express = require('express');
const mysql = require('mysql');

const app = express();

app.use(express.static('public'));

app.use(express.urlencoded({extended:false}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'fumi1995',
  database: 'dance_flyers_app'
});

connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');
});

app.get('/', (req, res) => {
  res.render('top.ejs');
});

app.get('/index', (req, res) => {
  connection.query(
    'SELECT * FROM flyers',
    (error, results) => {
      res.render('index.ejs', {flyers: results});
    }
  );
});

app.get('/new', (req, res) => {
  res.render('new.ejs');
});

app.post('/create', (req, res) => {
  connection.query(
    'INSERT INTO flyers (title) VALUES (?)',
    [req.body.title],
    (error, results) => {
      connection.query(
        'SELECT * FROM flyers',
        (error, results) => {
          res.redirect('index');
        }
      );
    }
  );
});

app.post('/delete/:id', (req, res) => {
  connection.query(
    'DELETE FROM flyers WHERE id=?',
    [req.params.id],
    (error, results) => {
      connection.query(
        'SELECT * FROM flyers',
        (error, results) => {
          res.redirect('/index');
        }
      );
    }
  );
});

app.get('/edit/:id', (req, res) => {
  connection.query(
    'SELECT * FROM flyers WHERE id=?',
    [req.params.id],
    (error, results) => {
      res.render('edit.ejs', {flyer: results[0]});
    }
  );
});

app.post('/update/:id', (req, res) => {
  connection.query(
    'UPDATE flyers SET title= ? WHERE id = ?',
    [req.body.title, req.params.id],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

app.listen(3000);
