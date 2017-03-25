//本を登録ボタンを表示する
function displayInputButton(){
    console.log("display");
    var btn = $("<ons-button id='input_button_area' onclick='inputBook()'>本を登録!</ons-button>");
    btn.appendTo($("#input_book_area"));
    ons.compile(btn[0]);
}


//本をmobile backendに登録する
function inputBook(){
    
    //フォームから本の情報を取得する
    var book_name = $("#book_name").val();
    var book_number = $("#book_number").val();
    var owner_name = $("#input_owner_name").val();

    //空の要素がないことを確認する
    if (book_name !== "" && book_number !== "" && owner_name !== ""){
        //Bookクラスのインスタンスを作成する
        var Book = ncmb.DataStore("Book");
        var ds = new Book;
        //取得した本の内容をセットする
        ds.set("book_name", book_name)
          .set("book_number", book_number)
          .set("owner_name", owner_name)
          .save()
          .then(function(resulte){
            $("#input_button_area").hide();
            $("#created_message").text("本の登録が完了しました！");
            //スコアの更新が完了したら、メニュー画面に遷移するボタンを表示させる
            var btn = $("<ons-button onclick='bookNavi.resetToPage(\"menu.html\")'>メニューに戻る</ons-button>");
            btn.appendTo($("#created_message"));
            ons.compile(btn[0]);
          })
          .catch(function(err){
            alert("保存に失敗しました。再度実行してください。");
            console.log(err);
          });
    } else {
        alert("未入力の項目があります。巻数がない場合には1巻として登録してください");
    }
}

var bookCount = 0;
//本を検索する
function showBooks(mode,name){
    //まずは本一覧をクリアする
    $("#booksList").empty();
    
    var owner_name = "";
    if (mode == "myBookshelf" ) {
        owner_name = ncmb.User.getCurrentUser().get("userName");
    } else if (mode == "groupMembersBookshelf") {
        owner_name = $('.owner_name', name).text();
    } else if (mode == "reload") {
        owner_name = name;
    } else {
        alert("modeエラー");
    }
    //指定された条件に合致する本の件数を調べる
    var ds = ncmb.DataStore("Book");
    ds.count()
      .equalTo("owner_name",owner_name)
      .fetchAll()
      .then(function(results){
            bookCount = results.count;
            $("#bookCount").text(bookCount);              
        })
      .catch(function(err){
            alert("counterror:" + error.message);
            console.log(err);
        });
    //本の数だけデータを取得する    
    ds.equalTo("owner_name",owner_name)
      .fetchAll()
      .then(function(results){
            var booksList = [];
            booksListHd = $("<ons-list-header><ons-row><ons-col>No.</ons-col><ons-col>タイトル</ons-col><ons-col>巻数</ons-col><ons-col>所有者</ons-col><ons-col>借りてる人</ons-col></ons-row></ons-list-header>");
            booksListHd.appendTo($("#booksList"));
            ons.compile(booksListHd[0]);
            for(var i = 0; i < results.length; i++){
                var book = results[i];
                drowBookList(book,i,mode,function(){
                    //callback
                });
            }
            $(".header_name").text(owner_name + "の本棚");
        })
      .catch(function(err){
        alert("データ取得エラー");
        alert(err);
      });
}


//詳細画面に移動する
function moveBorrowBookPage(callback){
    bookNavi.pushPage('borrowBookDtl.html');
    callback();
}

//借りる本をリスト化して表示する
function drowBookList(book,i,mode,callback) {
    var no = i + 1;
    var objectId = book.get("objectId");
    var book_name = book.get("book_name");
    var book_number = book.get("book_number");
    var owner_name = book.get("owner_name");
    var borrow_user = book.get("borrow_user");
    var booksList = [];

    booksList = $("<ons-list-item modifier='chevron' class='book_items' onclick='showBookDtl(this)'><ons-row class='row-item'><ons-col class='colno'></ons-col><ons-col class='book_name'></ons-col><ons-col class='book_number'>巻</ons-col><ons-col class='owner_name'></ons-col><ons-col class='borrow_user'>(いません)</ons-col></ons-row></ons-list-item>");
    booksList.find(".colno").text(no);
    booksList.find(".book_name").text(book_name);
    booksList.find(".book_number").text(book_number);
    booksList.find(".owner_name").text(owner_name);
    booksList.find(".borrow_user").text(borrow_user);
    booksList.appendTo($("#booksList"));
    
    ons.compile(booksList[0]);
    callback();
}

//本の詳細情報を表示する
function showBookDtl(o){
    var btn_drow_status = false;
    var book_name = $('.book_name', o).text();
    var book_number = $('.book_number', o).text();
    var owner_name = $('.owner_name', o).text();
    var borrow_user = $('.borrow_user', o).text();
    bookNavi.pushPage("bookDtl.html");
    $(document).on('pageinit', '#Book_Dtl_page', function() {
        $('.book_name_dtl',this).text(book_name);  
        $('.book_number_dtl',this).text(book_number);      
        $('.owner_name_dtl',this).text(owner_name);  
        $('.borrow_user_dtl',this).text(borrow_user);
        //自分が所有者だったら借りれないようにするために借りるボタンを作らない
        if (owner_name == ncmb.User.getCurrentUser().get("userName")){
            
        //まだボタンを作っていなかったら、初回ということで借りるボタンを作る
        } else if(btn_drow_status == false){
            var btn;
            btn = $("<ons-button modifier='large' style='margin: 0 auto;' onclick='borrowBook();'>本を借りる</ons-button>");
            btn.appendTo($("#borrow_book_button_field"));
            ons.compile(btn[0]);
            btn_drow_status = true;
        } else {
            //処理なし
        }
    });
}

//本を借りる処理
function borrowBook(){
    //フォームから本の情報を取得する
    //alert('start brw book function');
    var book_name = $(".book_name_dtl").text();
    var book_number = $(".book_number_dtl").text();
    var owner_name = $(".owner_name_dtl").text();
    var borrow_user = ncmb.User.getCurrentUser().get("userName");
    //Bookクラスのインスタンスを作成する
    var ds = ncmb.DataStore("Book");
        
    //取得した本の内容をセットする
    ds.equalTo("book_name",book_name)
      .equalTo("book_number",book_number)
      .equalTo("owner_name",owner_name)
      .fetchAll()
      .then(function(results){
          if(results.length == 0){
              alert("該当の本の情報が取得できませんでした");
          } else {
          results[0].set("borrow_user", borrow_user);
          results[0].update();
          alert(owner_name+"さんから「"+ book_name+"」の"+book_number+"巻を借りました")
          }
      })
      .then(function(results){
          showBooks("reload",owner_name);
          bookNavi.popPage();
      })
      .catch(function(err){
          alert(err);
      }); 
}


///// Delete memo
function onDeleteLink() {
    if (!confirm("この本を消しますか？")) {
      return;
    }
    var $li = $(this).parent();
    var id = $li.data("id");
    deleteMemo(id);
    
    initTopPage();
    
    // Return to top
    $.mobile.changePage("#showBook_Page", { reverse: true });
}

function showSettingPage(){
    bookNavi.pushPage('settings.html');
}