var express = require('express');
var myip = require('quick-local-ip');
var router = express.Router();
var underscore = require('underscore');
var mysql = require('mysql');

var fs = require('fs');
var root_node = ""; 
//var ctnrpath = 'D:\\NodeJS\\DBApp1';
var ctnrpath = '';

var another_ip = require('child_process').execSync("ifconfig | grep inet | grep -v inet6 | awk '{gsub(/addr:/,\"\");print $2}'").toString().trim().split("\n")[0];

var session_store;
var dirsJson = [];
var filesJson = [];
var count=2;



//files triversing
var traverseFileSystem = function (currentPath, subpath) {

    if(subpath == ""){
    	count=2;
    }
    //dirsJson.push({"path":currentPath});
    currentPath = currentPath+subpath;
    //console.log(currentPath);
    var files = fs.readdirSync(currentPath);
    
    for (var i in files) {
        var currentFile = files[i];
        var stats = fs.statSync(currentPath + '/' + currentFile);

        //if (stats.isFile()) {
          //filesJson.push({"file":currentFile});
          //console.log("File -      "+currentFile);
        //}else if (stats.isDirectory()) {
          //traverseFileSystem(currentFile);


          //a single file has a signle node
        node = {
          "id": (count++) + "",
          "text": currentFile,
          "file": stats.isFile() ? 1 : 0,
          "state": stats.isFile() ? "open" : "closed",
          "attributes": {"path": subpath}
        }
        if (currentFile.substr(0, 1) != ".") {
              if(node.text.includes(".")==true || node.file==0){
          dirsJson.push(node);
              }
            
          
        }
    }

    if(subpath == ""){

      // Windows
      //var arr = currentPath.split(String.fromCharCode(92)).join(String.fromCharCode(92,92)).split('\\'); 
      
      // Linux
      var arr = currentPath.split("/");
      console.log("Array here:"+arr);
      console.log("Currentpath.split here:"+arr[arr.length - 1]);

		dirsJson = [{
		    "id":1,
		    "text":root_node,
		    "state":"open",
		    "children": underscore.sortBy(dirsJson, "file"), 
		    "attributes":{
				"path":""
			}
    	}]
    }
};

var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }    
};

router.get('/read', function(req, res, next) {
  //console.log(req.query);
  //res.writeHead(200, {"Content-Type": "text/plain"});
  console.log("path : "+ctnrpath+req.query.name);
  var content = fs.readFileSync(ctnrpath+"/"+req.query.name,'utf8')
  console.log("File "+req.query.name+ " Loaded ....");
  res.end(content);
});


//saving file
router.post('/write', function(req, res, next) {
  console.log(req.query);
  filename=req.body.name;
  data=req.body.data;
  res.writeHead(200, {"Content-Type": "text/plain"});
  console.log("Starting saving path..."+ctnrpath); 
  var contents = fs.writeFileSync(ctnrpath+"/"+filename, data);
  console.log("File "+req.body.name+ " Saved ....");
  //console.log(contents);
  res.end("saved");  
});

/* GET home page. */

//route to get tree file namees
router.get('/files', function(req, res, next) {
  dirsJson = [];
  filesJson = [];
  //console.log(req.query.filename);
  traverseFileSystem(ctnrpath, req.query.filename)
  console.log("dirsJson : "+dirsJson.length);
  res.json(underscore.sortBy(dirsJson, "file"));
});

router.get('/register',sessionChecker,function(req, res, next) {
 res.render('register',{
         msg:null
       });
});

router.post('/register',function(req, res, next) {
  var userss=req.body.username;
  var pass=req.body.password;
  var email=req.body.email;
  var uuid;
     var conn = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Aeroplane.1"
});

conn.connect(function(err) {
     if (err) {
    res.render('register',{
         msg:'Connection error!'
       });
         console.log(err); 
  } 
      else
        {
    conn.query("Insert into cloudIDE.users(username,email,password) values('"+userss+"','"+email+"','"+pass+"')", function (err, result) {
  if(err)
 {
   console.log(err);
    res.render('register',{
         msg:'Database Error !'
       });
    console.log(err);
 }
 else
  {
    uuid=result.insertId;
    
      if (result.length <=0){
       res.render('register',{
         msg:'could not insert data !'
       });
      
    }
 
    else{
      
        console.log("ID:"+uuid);
    var cm = require('child_process').execSync("lxc copy ubuntu-C ubuntu-"+userss+" && lxc start ubuntu-"+userss);
     conn.query("Insert into cloudIDE.Containers(CNAME,UID) values('ubuntu-"+userss+"',"+uuid+")", function (err, result) {
      if(err)
 {
   console.log(err);
    res.render('register',{
         msg:'Database Error !'
       });
    console.log(err);
 }
  else
    {
conn.end();
   if (result.length <=0){
       res.render('register',{
         msg:'could not insert data !'
       });
      
    }
      else
        {
 res.render('login',{
         msg:null
       });
        }
    }
    
    });
      
  
            }
  }
  });

        }
 });
});

router.post('/checkusername',function(req, res, next) {
  var username=req.body.user_name;
    var con2 = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Aeroplane.1"
});

con2.connect(function(err) {
    if (err) {
    res.render('register',{
         msg:'Connection error!'
       });
         console.log(err); 
  } 
      else
        {
          if(req.body.user_name!=null)
            {
                 con2.query("select*from cloudIDE.users where username='"+username+"'", function (err, result) {
  if(err)
 {
   console.log(err);
    res.render('register',{
         msg:'Database Error !'
       });
    console.log(err);
 }
 else
  {
    con2.end();
      if (result.length <=0){
     res.send("OK");
      
    }
 
    else{
  res.send("User Name Already Exists");
            }
  }
  });
            }
        }
  });

});

router.post('/checkemail',function(req, res, next) {
  var email=req.body.user_email;
    var con3 = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Aeroplane.1"
});

con3.connect(function(err) {
    if (err) {
    res.render('register',{
         msg:'Connection error!'
       });
         console.log(err); 
  } 
      else
        {
          console.log(email);
  if(email!=null)
            {
                con3.query("select*from cloudIDE.users where email='"+email+"'", function (err, result) {
  if(err)
 {
   console.log(err);
    res.render('register',{
         msg:'Database Error !'
       });
    console.log(err);
 }
 else
  {
    con3.end();
      if (result.length <=0){
     res.send("OK");
      
    }
 
    else{
  res.send("Email Already Exists");
            }
  }
  });

            }
        }
  });

});

router.post('/checkContainer',function(req, res, next) {
  var email=req.body.user_email;
    var con3 = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Aeroplane.1"
});

con3.connect(function(err) {
    if (err) {
    res.render('register',{
         msg:'Connection error!'
       });
         console.log(err); 
  } 
      else
        {
          console.log(email);
  if(email!=null)
            {
                con3.query("select*from cloudIDE.Containers where CNAME='"+email+"'", function (err, result) {
  if(err)
 {
   console.log(err);
    res.render('register',{
         msg:'Database Error !'
       });
    console.log(err);
 }
 else
  {
    con3.end();
      if (result.length <=0){
     res.send("OK");
      
    }
 
    else{
      
  res.send("*Container with that Name Already Exists");
            }
  }
  });

            }
        }
  });

});
router.get('/',sessionChecker,function(req, res, next) {
 res.render('login',{
         msg:null
       });
});

router.post('/',function(req, res, next) {
    session_store=req.session;
    var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Aeroplane.1"
});
  con.connect(function(err) {
  if (err) {
    res.render('login',{
         msg:'Connection error!'
       });
  } 
else{
  console.log("Connected!");
  var user=req.body.username;
  var pass=req.body.password;
    con.query("select*from cloudIDE.users where username='"+user+"' and password='"+pass+"'", function (err, result) {
  if(err)
 {
   console.log(err);
    res.render('login',{
         msg:'Database Error !'
       });
    console.log(err);
 }
 else
  {
    con.end();
      if (result.length <=0){
       res.render('login',{
         msg:'invalid username or password!'
       });
      
    }
 
    else{
      var userid=null;
      result.forEach( (row) => { 
       userid=row.UID;
      });
      console.log(userid);
    req.session.user = user;
    req.session.uid=userid;
    res.redirect('/dashboard');
            }
  }
  });
}
});
});

/* GET home page. */
router.get('/dashboard', function(req, res, next) {
  var userarr = [];
  ctnrArr = [];
  if (req.session.user && req.cookies.user_sid) {
   
    var cony = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Aeroplane.1"
});

  cony.connect(function(err) {
  if (err) {
    res.render('login',{
         msg:'Connection error!'
       });
  } 
else{
  console.log("Connected!");
  var userid=req.session.uid;
    cony.query("select*from cloudIDE.Containers where UID='"+userid+"'", function (err, result) {
  if(err)
 {
   console.log(err);
    res.render('login',{
         msg:'Database Error !'
       });
    console.log(err);
 }
 else
  {
    cony.end();
      if (result.length <=0){
       res.render('default',{
         'ip': another_ip,
          ctnr : ctnrArr,
         username:req.session.user
       });
      
    }
 
    else{
      
      result.forEach( (row) => { 
       userarr.push({'cname':row.CNAME,'Language':row.Language});
      });



for (var i = 0; i < userarr.length; i++) {
  console.log(userarr[i]);

  ctnrs = JSON.parse(require('child_process').execSync("lxc list ^"+userarr[i].cname+"$ --format json").toString().trim());
  

  for(var index in ctnrs){
    ctnrArr.push({
        'name' : ctnrs[index].name, 
        'ip' : ctnrs[index].state.network.eth0.addresses[0].address,
        'ram': ctnrs[index].state.memory.usage,
        'processes':ctnrs[index].state.processes,
        'architecture':ctnrs[index].architecture,
        'created':ctnrs[index].created_at,
        'ip6':ctnrs[index].state.network.eth1.addresses[0].address,
        'Language':userarr[i].Language,
    });
    console.log(ctnrs[index].name+ " : " +ctnrs[index].state.network.eth0.addresses[0].address+":memory="+ctnrs[index].state.memory.usage);
  }
   };  
  ctnrpath = 
  res.render('default', {
    title: 'ClouIDE-Dashboard' , 
    'ip': another_ip,
    ctnr : ctnrArr,
    username:req.session.user
    });
       }
  }
  });
}
});
  }else
  {
    res.redirect('/');
  }

});

/* GET home page. */
router.get('/xhr', function(req, res, next) {
if (req.session.user && req.cookies.user_sid) {
console.log(req.query.ctrname);
console.log("meri ip:"+req.query.ip);
  //ind = 0;
  //'ip': another_ip,
  root_node = req.query.name;
  ctnrpath='/var/lib/lxd/containers/'+req.query.name+'/rootfs/root';
  console.log('ctnrpath : '+ ctnrpath);
  res.render('tree', {
    title: 'Editor', 
    'ip': another_ip,
    ctnr_name : req.query.name, 
    ctnr_ip : req.query.ip,
    username:req.session.user,
    Language:req.query.lang,
    containerpath: ctnrpath
  });
}else{
  res.redirect('/');
}

});


router.get('/create',function(req, res, next) {
//console.log(req.query.ctrname);
//res.send(req.query.ctr);
var name=req.query.ctrname;
var language=req.query.language;
var id=req.session.uid;
var cc = require('child_process').execSync("lxc copy ubuntu-"+language+" "+name+" && lxc start "+name+"");

    var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Aeroplane.1"
});
  con.connect(function(err) {
  if (err) {
    res.render('login',{
         msg:'Connection error!'
       });
  } 
else{
  console.log("Connected!");
    con.query("Insert into cloudIDE.Containers(CNAME,UID,Language) values('"+name+"',"+id+",'"+language+"')", function (err, result) {
  if(err)
 {
   console.log(err);
    res.render('login',{
         msg:'Database Error !'
       });
    console.log(err);
 }
 else
  {
    con.end();
      if (result.length <=0){
 
    }
 
    else{
    res.redirect('/dashboard');
            }
  }
  });
}
});


});

router.get('/delete',function(req, res, next) {
console.log(req.query.ctrname);
//res.send(req.query.ctr);
var name=req.query.ctrname;
var cc = require('child_process').execSync("lxc stop "+name+" && lxc delete "+name+"");

    var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Aeroplane.1"
});
  con.connect(function(err) {
  if (err) {
    res.render('login',{
         msg:'Connection error!'
       });
  } 
else{
  console.log("Connected!");
    con.query("delete from cloudIDE.Containers where CNAME='"+name+"'", function (err, result) {
  if(err)
 {
   console.log(err);
    res.render('login',{
         msg:'Database Error !'
       });
    console.log(err);
 }
 else
  {
    con.end();
      if (result.length <=0){
 
    }
 
    else{
    res.redirect('/dashboard');
            }
  }
  });
}
});


});


router.get('/logout', function(req, res)
{ 
     if (req.session.user && req.cookies.user_sid) {
         res.clearCookie('user_sid');
         res.redirect('/');
    }
  
 /*req.session.destroy(function(err)
 { 
 if(err)
 { 
 console.log(err); 
 } 
 else 
 {    
     if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
         res.redirect('/');
    }
 } 
 }); */
});


module.exports = router;
