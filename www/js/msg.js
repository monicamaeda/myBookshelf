function showLogoutMsg() {
  ons.notification.alert({
    message: 'ログアウトしました。',
    // もしくはmessageHTML: '<div>HTML形式のメッセージ</div>',
    title: 'ログイン操作',
    buttonLabel: 'OK',
    animation: 'default', // もしくは'none'
    // modifier: 'optional-modifier'
    callback: function() {
      // ボタンがタップされた
    }
  });
}

function makeNewGroupMsg(roleName) {
  ons.notification.alert({
    message: '新しいグループ['+ roleName + ']ができました！',
    title: 'お知らせ',
    buttonLabel: 'OK',
    animation: 'default', // もしくは'none'
    callback: function() {
        
    }
  });
}

function joinGroupMsg(roleName) {
  ons.notification.alert({
    message: 'グループ['+ roleName + ']に参加しました！',
    title: 'お知らせ',
    buttonLabel: 'OK',
    animation: 'default', // もしくは'none'
    callback: function() {
        
    }
  });
}

function joinChooseUserInMyGroup(user,rollName){
  ons.notification.confirm({
    message: '['+ user.get("userName") + ']さんをグループに入れますか？自分の['+rollName+']グループに入れると、お互いの本棚をみせることができ、お互いの本の貸し借りができるようになります。',
    // もしくは messageHTML: '<div>HTML形式のメッセージ</div>',
    title: '確認',
    buttonLabels: ['はい', 'いいえ'],
    animation: 'default', // もしくは'none'
    primaryButtonIndex: 1,
    cancelable: true,
    callback: function(index) {
        if(index == 0){
            addRole(user,rollName);
        } else if (index == 1){
            
        }
      // -1: キャンセルされた
      // 0-: 左から0ではじまるボタン番号
    }
  });
}