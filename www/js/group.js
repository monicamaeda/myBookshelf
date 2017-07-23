//グループ一覧を取得
function getGroupsList(groupType){
    var currentUser = ncmb.User.getCurrentUser();
    var groupList = [];
    var equalToFirld = ";"
    var equalToText = ";"
    if (groupType == "myGroups"){
        equalToFirld = '"roleAdmin"';
        equalToText = (currentUser.get("userName"));
    } else if (groupType == "belongGroups"){
        equalToFirld = '"belongUser"';
        //ここには自分が所属しているユーザーリストだけが来るイメージ。そのグループを一致文表示したらいい。
        equalToText = ("oya");
    }
    //自分が所属しているグループ一覧を取得
    ncmb.Role.equalTo("roleAdmin",equalToText)
             .fetchAll()
             .then(function(results){
                if (results.length == 0 ){
                    alert("対象となるグループがありません。まずはグループを作成してください");
                    bookNavi.popPage();
                } else {
                    var groupListHd = [];
                    groupsListHd = $("<ons-list-header class='group_items''><ons-row class='row-item'><ons-col class='colno'>NO</ons-col><ons-col class='group_name'>グループ名</ons-col></ons-row></ons-list-header>");
                    if (groupType == "myGroups"){
                        groupsListHd.appendTo($("#myGroupListView"));
                    } else if (groupType == "belongGroups") {
                        groupsListHd.appendTo($("#groupListView"));
                    }
                    ons.compile(groupsListHd[0]);
                    for (i = 0; i < results.length; i++){
                        var group = {
                            'roleName':results[i].get("roleName")
                        };
                        groupList.push(group);
                        drowGroupList(groupType,results[i],i,function(){
                            //callback
                        });
                    }
                return groupList;
		        }
             })		  
             .catch(function(err){
                 alert(err);
             })
}

//グループをリスト化して表示する
function drowGroupList(groupType,group,i,callback) {
    var no = i + 1;
    var objectId = group.get("objectId");
    var group_name = group.get("roleName");
    var groupsList = [];
    if (groupType == "myGroups"){
        groupsList = $("<ons-list-item modifier='chevron' class='group_items' onclick='serachUser(this)'><ons-row class='row-item'><ons-col class='colno'></ons-col><ons-col class='group_name'></ons-col></ons-row></ons-list-item>");
    } else if (groupType == "belongGroups"){
        groupsList = $("<ons-list-item modifier='chevron' class='group_items' onclick='goGroupBelongUser(this)'><ons-row class='row-item'><ons-col class='colno'></ons-col><ons-col class='group_name'></ons-col></ons-row></ons-list-item>");
    }
    groupsList.find(".colno").text(no);
    groupsList.find(".group_name").text(group_name);
    if (groupType == "myGroups"){
        groupsList.appendTo($("#myGroupListView"));
    } else if (groupType == "belongGroups"){
        groupsList.appendTo($("#groupListView"));
    }
    ons.compile(groupsList[0]);
    callback();
}

function serachUser(o){
    bookNavi.pushPage("html/user/showUsers.html");
    var group_name = "";
    group_name = $(".group_name",o).text();
    $(document).on('pageinit', '#show_users_page', function() {
        $("#choose_group_name").text(group_name);
    })
}

function goGroupBelongUser(o){
    bookNavi.pushPage("html/group/showGroupUsers.html");
    //group情報を渡して、所属ユーザーだけを表示する
    getUsersList();
}

//グループをリスト化して表示する
function drowGroupingUserList(user,group,i,callback) {
    var no = i + 1;
    var objectId = group.get("objectId");
    var group_name = group.get("roleName");
    var groupsList = [];
    groupsList = $("<ons-list-item modifier='chevron' class='group_items' onclick='addUserIntoGroup(user,this)'><ons-row class='row-item'><ons-col class='colno'></ons-col><ons-col class='group_name'></ons-col></ons-row></ons-list-item>");
    groupsList.find(".colno").text(no);
    groupsList.find(".group_name").text(group_name);
    groupsList.appendTo($("#groupingUserListView"));
    
    ons.compile(groupsList[0]);
    callback();
}

//グループのメンバー一覧に移動
function addUserIntoGroup(user,o){
    ncmb.Role.equalTo("roleName", o)
             .fetchAll()
             .then(function(results){
                if (results.length == 0 ){
                    alert("roleがないです");
                } else {
                    alert("取得したroleの数："+results.length);
                    alert("rolename:"+results[0].get("roleName"));
                    var r = results[0]
                    r.addUser(user)
                     .update()
                     .then(function(results){
                        alert("OK");
                     })
                     .catch(function(err){
                        alert(err);
                     });
                }
             })
             .catch(function(err){
                alert(err);
             })
}

//グループのメンバー一覧に移動
function showGroupUsersList(o){
    var group_name = $('.group_name', o).text();
    bookNavi.pushPage("html/group/showGroupUsers.html");
    getGroupInUsersList(group_name);
}

//ここが動いてない。RoleのUSER取れない。
function getGroupInUsersList(group_name){
    var userList = [];
    ncmb.Role.eaualTo("roleName",group_name)
             .fetchAll(function(err,results){
                if (results.length == 0 ){
    	            alert("グループが選択できませんでした");
		        } else {
                    alert("取得したroleの数："+results.length);
                    Users = results.fetchUser();
                    alert(Users)
                    for (i = 0; i < results.length; i++){
                        var user = {
                            'userName':Users[i].get("userName")
                        };
                        groupList.push(group);
                        //多分これでいいはず
                        drowOwnerList(Users[i],i,function(){
                            //callback
                        });
                    }
                return groupList;
		        }
              });
}

//グループをリスト化して表示する
function drowGroupInUsersList(name,i,callback) {
    var no = i + 1;
    var objectId = group.get("objectId");
    var group_name = group.get("roleName");
    var groupsList = [];
    groupsList = $("<ons-list-item modifier='chevron' class='group_items' onclick='showGroupUserList(this)'><ons-row class='row-item'><ons-col class='colno'></ons-col><ons-col class='group_name'></ons-col></ons-row></ons-list-item>");
    groupsList.find(".colno").text(no);
    groupsList.find(".group_name").text(group_name);
    groupsList.appendTo($("#groupListView"));
    
    ons.compile(groupsList[0]);
    callback();
}

//グループのメンバー一覧に移動
function showUserList(o){
    var group_name = $('.roleName', o).text();
    bookNavi.pushPage("html/group/showGroupUsers.html");
    getUsersList(group_name);
    
}

//RoleにUserを追加登録する
function addRole(user,role){
    var settingUser = [];
    if (user != []){
        settingUser = user;
    } else {
        var currentUser = ncmb.User.getCurrentUser();
        settingUser = currentUser;
    }
    ncmb.Role.equalTo("roleName", role)
             .fetchAll()
             .then(function(results){
            	if (results.length == 0 ){
		            alert("roleがないです");
		        } else {
            	    var r = results[0];
                	r.addUser(settingUser)
                     .update()
                     .then(function(results){
                        alert("グループに所属させました");
                        //bookNavi.popPage();
                     })
                     .catch(function(err){
                        alert(err);
                     });
		        }
             })
             .catch(function(err){
                alert(err);
             });
}



//グループに参加
function addMeToGroup(groupName){
    var currentUser = ncmb.User.getCurrentUser();
    alert(currentUser.get("userName"))
    ncmb.Role.equalTo("roleName", groupName)
        .fetchAll()
        .then(function(role){
            alert(role.length);
            role[0].addUser(currentUser.get("userName"))
                   .update()
                   .then(function(results){
                        joinGroupMsg(groupName);            
                   })
                   .catch(function(err){
                        alert(err);
                   });
        })
        .catch(function(err){
            alert(err);
        })
}

//groupの作成（作成者が同時にgroupに所属される）
function makeNewGroup(){
    var groupName = $('#input_group_name').val();
    var groupDisp = $('#input_group_disp').val();
    var groupAdmin = $('#input_group_Admin').val();
    var currentUser = ncmb.User.getCurrentUser();
    var DS = new ncmb.Role(groupName);
    
    DS.addUser(currentUser);
    DS.set("roleDisp",groupDisp);
    DS.set("roleAdmin",groupAdmin);
    DS.save()
      .then(function(){
            makeNewGroupMsg(groupName);
            bookNavi.popPage();
      })
      .catch(function(err){
           alert(err);
      })
}

//group一覧を表示
function showGroupsList(){
    ncmb.Role.fetchAll()
             .then(function(role){
                 
        alert(role.length);
        alert(role[0].get("roleName"));
        alert(role[1].get("roleName"));
             })
}


//以下テスト用
function getMyBelongGroup(groupName){
    var currentUser = ncmb.User.getCurrentUser();
//    alert("currentUser:"+currentUser.get("userName"));
    ncmb.Role.fetchAll()
             .then(function(results){
//                 alert(results.length);
                alert(results[0].get("roleName"))
                return results[0].fetchUser();
                })
                .then(function(result){
                alert(result);
                alert(result[0].userName);
                alert(result[1].userName);
                    
                 
             })
             .catch(function(err){
                 alert(err);
             })
    
}

function getUserBelongGroup(roleName){
    ncmb.Role.fetchAll()
             .then(function(results){
                return results[0].fetchUser();
             })
             .then(function(users){
                alert(users.length);
                alert(users[0].userName);
                alert(users[1].userName);
             })
             .catch(function(err){
                 alert(err);
             })   
}

function roleAddAclTest(){
    var currentUser = ncmb.User.getCurrentUser();
    ncmb.Role.equalTo("roleAdmin","ko")
             .fetchAll()
             .then(function(results){
    //aclをPublicにして、誰でもアクセスできるようにする。
    alert(results[0].roleName);
    var acl = new ncmb.Acl();
//    acl.setUserReadAccess(currentUser, true);
//    acl.setUserWriteAccess(currentUser, true);
//    acl.setPublicReadAccess(false);
    acl.setPublicWriteAccess(false);
    results[0].set("acl",acl)
    results[0].update();
    alert("4");
             })
}
