//roleを作成する
function makeRoleTest(){
    var makeNewRole = new ncmb.Role($('#rolenametest').val());
    makeNewRole.save()
                .then(function(){
                    alert("success new role :" + $('#rolenametest').val())
                })
                .catch(function(err){
                    alert("err makeRoleTest")
                });
}


//userをroleに所属させる
function belongUserForRoleTest(){
    //ログインユーザーをuserオブジェクトに入れる
    var user = ncmb.User.getCurrentUser();
    //既存のロールを検索
    ncmb.Role.equalTo("roleName",$('#rolenametest').val())
             .fetch()
             .then(function (role){
                if (JSON.stringify(role) === "{}") {
                    alert("err no fetch rolename")
                } else {
                    //会員をロールに追加
                    role.addUser(user).update()
                                      .then(function (role){
                                          alert("Success!! add user:" + user.get("userName") + " for role:" + $('#rolenametest').val())
                                      }).catch(function(err) {
                                          alert("error add user for role")
                    });
                }
            }).catch(function (err){
                alert("please input rolename or login")
            });
}

//TODO なんかうまく動かない
//belongUserを取得する
function checkBelongUserListTest() {
    ncmb.Role
        .equalTo("roleName",$('#rolenametest').val())
        .fetch()
         .then(function(role){
             return role.fetchUser();
         })
        .then(function(users){
            alert(users);
            for (var i = 0; i < users.length; i++) {
                alert(users.length);
                var user = users[i];
            }
         })
        .catch(function(err){
            alert("error no fetch rolename")
         });
}

//権限を付与する
function addRoleForRecordTest(){
    //aclの状態をどういった形で登録したいかを定義する
    var acl = new ncmb.Acl();
    acl.setRoleReadAccess($('#rolenametest').val(), true) // 入力したロールの読み込みを許可
       .setRoleWriteAccess($('#rolenametest').val(), true) // 入力したロールの書き込みを許可
    //alert(JSON.stringify(acl));
    
    //setしたいレコードを読み出す
    var testData = ncmb.DataStore("testData");
    testData.fetchAll()
        .then(function(results){
            // テストなんで１個めのデータに付与する。一致するデータが１つのみだと、やりやすい
            var getTestData = results[0];
            // 読み出したレコードに新しくaclを設定する
            getTestData.set("acl", acl);
            //alert(JSON.stringify(getTestData));
            getTestData.update();
            alert("success acl update");
        })
        .catch(function(err){
            alert("Error:no data testdata can't fetch");
        });    
}