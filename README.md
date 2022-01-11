# readme
FirebaseとNext.jsの練習、テンプレート

## todo
- firebaseとの連携
- hosting
- auth
  - ログイン画面
    - react-hook-form
  - 新規登録画面
      - react-hook-form
  - ログイン情報の状態管理
    - 状態管理を作る
    - 上記でwrapする
  - ルーティング
  - ログイン状態で新規登録、ログインができないようにする
- firestore
  - エミュレータ

## firebaseとの連携
- .env.localにfirebaseの設定情報を記述
- infrastructure/firebase/initをつくる

## hosting
`firebase init`
hostingを選択
firebase.jsonに以下のようにページ分追加
rewritesを追加しないでダイレクトアクセスすると404になる
```json
    "rewrites": [
      {
        "source": "/sign-in",
        "destination": "/sign-in.html"
      },
    ]
```
`firebase deploy`する
package.jsonに記述 `"deploy": "firebase deploy",`
