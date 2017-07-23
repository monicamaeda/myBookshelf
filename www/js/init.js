//ページの初期化が完了したら実行される
//ncmbへ接続をする際の定義
var ncmb;
$(function (){
    console.log("init start");
    ncmb = new NCMB(
        "5a1f4dda3fe8257b6a1b4867226feca81e92fbd1a76525a62084358284309367",
        "861f59cb483906cc4576b145113a6578b21956a35259146d6e35b47c3e12f310"
    );
    console.log("NCMB connect success!");

    $(document.body).on('pageinit', '#input_book_page', function() {displayInputButton();});     
});
