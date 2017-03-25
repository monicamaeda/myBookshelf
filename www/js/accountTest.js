// This is a JavaScript file

//Userクラスの中身を確認するためのグローバル変数
var glovalUser = "none";

//ユーザー名が表示される確認
function a(){
    alert($("#nametest").val());
}

function makeUserTest(){
//Userのインスタンスを作成
var user = new ncmb.User();

//ユーザー名・パスワードを設定
user.set("userName", $("#nametest").val())
    .set("password", $("#passtest").val())

// 新規登録
user.signUpByAccount()
    .then(function(){
      alert("success user name:"+ $("#nametest").val())
    })
    .catch(function(err){
      alert("error");
    });
}


//ncmb.User.loginはカレントユーザーにログイン情報を保持させる。
//セッショントークンもカレントユーザーに持っている。
//同時に、Userインスタンスにもセッショントークンを持つ。

//ncmb.loginはカレントユーザーはいじらない。
//セッショントークンはインスタンスにのみ持つ。

function loginTest1(){
// ユーザー名とパスワードでログイン
ncmb.User.login($("#nametest").val(), $("#passtest").val())
    .then(function(data){
      alert("success loginTest1")
    })
    .catch(function(err){
      alert("error");
    });
}

function loginTest2(){
// ユーザー名とパスワードをもつUserインスタンスでログイン
var user = new ncmb.User({userName:$("#nametest").val(), password:$("#passtest").val()});
ncmb.User.login(user)
    .then(function(data){
      alert("success loginTest2")
    })
    .catch(function(err){
      alert("error");
    });
}

//instanceにログインして渡すのみ
function loginOnlyInstance(){
var user = new ncmb.User({userName:$("#nametest").val(), password:$("#passtest").val()});
glovalUser = user;
user.login()
    .then(function(data){
      alert("success loginTest Only Instance")
    })
    .catch(function(err){
      alert("error");
    });
}

//logoutのシンプル版
function logoutTest(){
    ncmb.User.logout()
        .then(function(data){
            alert("success logout")
        })
        .catch(function(err){
            alert("error");
        })
}

//インスタンスログインをしている場合にはインスタンスログアウト
function logoutPrototypeTest(){
    user = glovalUser;
    user.logout()
        .then(function(data){
            alert("success logout prototype");
            glovalUser = user;
        })
        .catch(function(err){
            alert("error");
        })
}

//カレントユーザーのget処理。このときに同時にセッショントークンで接続をし直す
function getCurrentUserName(){
    var currentUser = ncmb.User.getCurrentUser();
    if (currentUser) {
        alert("ログイン中のユーザー: " + currentUser.get("userName"));
    } else {
        alert("未ログインまたは取得に失敗");
    }
}

//CurrentUserとuserが一緒確認する
function checkCurrentUserTest(){
    var user = glovalUser;
    alert(user.isCurrentUser());    
}

//userの中身を確認する
function callGlovalUser(){
    alert(JSON.stringify(glovalUser));
}

//CurrentUserでの接続をする
function loginCurrentUser(){
var currentUser = ncmb.User.getCurrentUser();  
ncmb.User.login(currentUser)
    .then(function(data){
      alert("success currentUser")
    })
    .catch(function(err){
      alert("error");
    });
}


//セッショントークンが有効か判別するために接続する
function getAndWriteLavel(){
    $("#testLavel").empty();
    var ds = ncmb.DataStore("testData");
    ds.fetchAll()
      .then(function(results){
            testData = results[0].get("name");
            $("#testLavel").text(testData);              
        })
      .catch(function(err){
            alert("Error:getAndWriteLavel");
        });
}

//テスト用のhtmlに移動する
function moveAccountTest(){
    bookNavi.pushPage("html/accountTest.html");
}
