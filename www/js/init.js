//ページの初期化が完了したら実行される
//ncmbへ接続をする際の定義
var ncmb;
$(function (){
    console.log("init!");
    ncmb = new NCMB(
        "10ef103b7bbbb411d5843a3ef85bc708a7b85394e3f73c0fb92d9be7dd8cba66",
        "f77d673706ce1b140cf4fdac0ef69e30cdd33ae7c016ce46ccea6d2feae99075"
    );
    console.log("NCMB connect success!");

    $(document.body).on('pageinit', '#input_book_page', function() {displayInputButton();});     
});
