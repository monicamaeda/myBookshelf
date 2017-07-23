//ログイン済みかを確認する
function checkCurrentUser(){
    //画面遷移時のアニメーションを設定
    var options = {
        animation: 'lift', // アニメーションの種類
        onTransitionEnd: function() {} // アニメーションが完了した際によばれるコールバック
    };
    var currentUser = ncmb.User.getCurrentUser();
    if (currentUser){
        ncmb.User.fetch()
            .then(function(results){
                bookNavi.pushPage("common.html", options);
                console.log("currentUserName is " + currentUser.get("userName"));
            })
            .catch(function(err){
                ncmb.User.logout();
                bookNavi.pushPage("login.html", options);
            });
    } else {
        //未ログインの場合はログイン画面を表示
        bookNavi.pushPage("login.html", options);
    }
}

//ログアウトを実行し、ホーム画面に遷移させる
function logout(){
    ncmb.User.logout()
    .then(function(result){
        showLogoutMsg();
        bookNavi.resetToPage("home.html");
    })
    .catch(function(err){
        //基本的にはこの処理は通らない
        console.log(err);
        bookNavi.pushPage("login.html");
    });
}

//会員登録・ログインを行う
function userLogin(signUpFlag){
    //入力フォームからユーザー名とパスワードを取得
    var userName = $("#user_name").val();
    var password = $("#password").val();
    if (signUpFlag === false){
        //ログイン処理を実行し、上で設定されたコールバックが実行される
        ncmb.User.login(userName, password)
            .then(function(data){
              bookNavi.pushPage("common.html");
            })
            .catch(function(err){
                alert("ログインに失敗しました。ユーザーとパスワードが合っているか確認してください。");
                console.log(err.message);
            })
    } else {
        //会員のインスタンスを作成
        var user = new ncmb.User();
        
        //ユーザー名とパスワードとスコアをインスタンスに設定
        user.set("userName", userName);
        user.set("password", password);
        
        //aclをPublicにして、誰でもアクセスできるようにする。
        var acl = new ncmb.Acl();
        acl.setPublicReadAccess(true);
        acl.setPublicWriteAccess(true);
        //権限をセット
        user.set("acl", acl);
        
        //会員登録を実行し、上で設定されたコールバックが実行される
        user.signUpByAccount()
            .then(function(data){
              bookNavi.pushPage("common.html");
              ncmb.User.login(userName, password);
            })
            .catch(function(err){
                alert("ユーザー作成を失敗しました。再度試してだめな場合にはお問合せください");
            })
    }
}

//登録時の本の所有者欄にログインユーザーを入れる
function setOwnerName(){
    var currentUser = ncmb.User.getCurrentUser();
    if ($(".owner_name").val() == ""){
        $(".owner_name").val(currentUser.userName);
    }
}

$(document).on('pageinit', '#menu_page', function() {
    alert(currentUser.get("userName"));
    var currentUser = ncmb.User.getCurrentUser();
    alert(currentUser);
    $("#title_user_name").val(currentUser.get("userName"));
});

//ユーザー名を表示する（テスト用）
function alertUsersName(){
    var User = ncmb.User;
    User.fetchAll()
        .then(function(results){
            alert(results.length)
            for(var i = 0; i < results.length; i++){
            var owner = results[i];
            alert(owner.get("userName"))
        }
    })
}

//ユーザーリストを取得する
function getUsersList(userName){
    var UserList = [];
    //if groupnameが引数できたら、fetchUser else fetchAll? 常にFetcthuserでいいきもする
    //if 人の名前がきたら、それで検索する
    var DS = ncmb.User;
//    if (userName != ""){
//        alert(userName);
//    } 
//        DS.equalTo("userName", userName)
            DS.fetchAll()
             .then(function(results){
                if (results.length == 0 ){
                    alert("ユーザー情報の取得に失敗しました。ユーザーがいません");
    	        } else {
                    var ownersListHd = [];
                    ownersListHd = $("<ons-list-header><ons-row><ons-col>No.</ons-col><ons-col>本棚の所有者</ons-col></ons-row></ons-list-header");
                    ownersListHd.appendTo($("#groupUsersListView"));
                    ownersListHd.appendTo($("#usersListView"));
                    ons.compile(ownersListHd[0]);
                    for(var i = 0; i < results.length; i++){
                        var owner = results[i];
                        //自分をリストから外す
                        if (owner.get("userName") == ncmb.User.getCurrentUser().get("userName")){
                            
                        } else {
                            drowOwnerList(owner,i,function(){
                                //callback
                            });
                        }
                    }
		        }
              })
              .catch(function(err){
                  alert(err);
              });
}

//グループのユーザーリストを表示する
function getOwnerIntoGroupList(groupName){
    var UserList = [];
    //if groupnameが引数できたら、fetchUser else fetchAll? 常にFetcthuserでいいきもする
    //if 人の名前がきたら、それで検索する
    ncmb.User.fetchAll()
             .then(function(results){
                if (results.length == 0 ){
                    alert("ユーザー情報の取得に失敗しました。");
    	        } else {
                    var ownersListHd = [];
                    ownersListHd = $("<ons-list-header><ons-row><ons-col>No.</ons-col><ons-col>仲間に入れたい人</ons-col></ons-row></ons-list-header");
                    ownersListHd.appendTo($("#groupUsersListView"));
                    ownersListHd.appendTo($("#usersListView"));
                    ons.compile(ownersListHd[0]);
                    for(var i = 0; i < results.length; i++){
                        var owner = results[i];
                        //自分をリストから外す
                        if (owner.get("userName") == ncmb.User.getCurrentUser().get("userName")){
                            
                        } else {
                            drowChoseOwnerIntoGroupList(owner,i,function(){
                                //callback
                            });
                        }
                    }
		        }
              })
              .catch(function(err){
                  alert(err);
              });
}

function drowOwnerList(owner,i,callback,mode) {
    var no = i + 1;
    var objectId = owner.get("objectId");
    if (mode == "friend"){
        var owner_name = owner.get("bookShelfOwner");
    } else {
        var owner_name = owner.get("userName");
    }
    var ownersList = [];
    
    ownersList = $("<ons-list-item modifier='chevron' class='owners_items' onclick='actionShowBook(this)'><ons-row class='row-item'><ons-col class='colno'></ons-col><ons-col class='owner_name'></ons-col></ons-row></ons-list-item>");
    ownersList.find(".colno").text(no);
    ownersList.find(".owner_name").text(owner_name);
    ownersList.appendTo($("#groupUsersListView"));
    ownersList.appendTo($("#usersListView"));
    ownersList.appendTo($("#friendsListView"));
    ons.compile(ownersList[0]);
    callback();
}

function drowChoseOwnerIntoGroupList(owner,i,callback) {
    var no = i + 1;
    var objectId = owner.get("objectId");
    var owner_name = owner.get("userName");
    var ownersList = [];
    
    ownersList = $("<ons-list-item modifier='chevron' class='owners_items' onclick='choseUserIntoGroup(this)'><ons-row class='row-item'><ons-col class='colno'></ons-col><ons-col class='owner_name'></ons-col></ons-row></ons-list-item>");
    ownersList.find(".colno").text(no);
    ownersList.find(".owner_name").text(owner_name);
    ownersList.appendTo($("#usersListView"));
    
    ons.compile(ownersList[0]);
    callback();
}

function choseUserIntoGroup(o){
    var groupingUserName = $(".owner_name",o).text();
    getGroupList(groupingUserName);
}

function actionShowBook(o){
    bookNavi.pushPage('booksList.html');
    showBooks('groupMembersBookshelf',o);
}

//ユーザー名を完全一致で検索して、権限を与える巻数
function searchUser(mode){
    checkUser($('.search_user_name').val(),function(){
        
    },mode);
}

//ユーザーがいるかどうかチェックする
function checkUser(userName,rollback,mode){
    var UserList = [];
    var DS = ncmb.User;
        DS.equalTo("userName", userName)
            .fetchAll()
            .then(function(results){
            if (results.length == 0 ){
                alert("ユーザー情報の取得に失敗しました。ユーザーがいません");
            } else {
                if(mode == "GroupMode"){
                    joinChooseUserInMyGroup(results[0],$("#choose_group_name").text());
                } else if(mode == "BookShelfMode"){
                    var userMyBookShelf = ncmb.DataStore("userMyBookShelf");
                    userMyBookShelf.equalTo("userName",results[0].get("userName"))
                                   .fetchAll()
                                   .then(function(results2){
                                       if(results2.length == 0){
                                           friendCanLookMyBookShelfMsg(results[0]);   
                                       } else {
                                            alert("すでに[" + results2[0].get("userName") + "]さんはあなたの本棚を見れます")
                                       }
                                   })
                }
            }    
            })
            
            .catch(function(err){
                alert(err);
            });
}

//本棚を見せられるようにする
function addUserMyBookShelf(user){
    var currentUser = ncmb.User.getCurrentUser();
    var userMyBookShelf = ncmb.DataStore("userMyBookShelf");
    var ds = new userMyBookShelf;
    //取得した本の内容をセットする
    ds.set("userName",user.get("userName"))
      .set("bookShelfOwner",currentUser.get("userName"))
      .save()
      .then(function(results){
        alert("本を貸せるようになりました。");
      })
      .then(function(results){
          bookNavi.popPage();
      })
      .catch(function(err){
          alert(err);
      }); 

}

//ユーザーリストを取得する
function getFriendsList(){
    var UserList = [];
    var currentUser = ncmb.User.getCurrentUser();
    var DS = ncmb.DataStore("userMyBookShelf");
    
        DS.equalTo("userName", currentUser.get("userName"))
          .fetchAll()
          .then(function(results){
            if (results.length == 0 ){
                alert("友達の本棚が見れるように設定されていません。友達に本棚を見れるように設定してもらってください");
            } else {
                    var ownersListHd = [];
                    ownersListHd = $("<ons-list-header><ons-row><ons-col>No.</ons-col><ons-col>本棚の所有者</ons-col></ons-row></ons-list-header");
                    ownersListHd.appendTo($("#friendsListView"));
                    ons.compile(ownersListHd[0]);
                    for(var i = 0; i < results.length; i++){
                        var owner = results[i];
                        drowOwnerList(owner,i,function(){
                                //callback
                        },"friend");
                    }
            }
          })
          .catch(function(err){
            alert(err);
          });
}


