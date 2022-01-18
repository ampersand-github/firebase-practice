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

## auth
[2021年11月にNext.jsとTypescriptでFirebase AuthでGoogle ログインする方法 React – 日刊ハイテク情報誌の マガジンOFFです! 毎日IT系のニュースを 配信しています！](https://off.tokyo/blog/next-js-typescript-firebase-auth-google/)
★[【完全版】ReactのFirebase Authentication(認証)を基礎からマスター | アールエフェクト](https://reffect.co.jp/react/react-firebase-auth)
[【徹底解説】ReactにFirebase Authentication(ログイン認証)を実装する方法](https://onityanzyuku.com/react-firebase-auth/)
[Next.jsでFirebase Authenticationを使う(with Context API)](https://zenn.dev/wattanx/articles/1b8d4b7b92a237)
[Next.js で Firebase Authentication を利用し, Google ログインを実装した](https://zenn.dev/minguu42/articles/20210705-nextjs-auth)
[Next.js × TypeScript × Firebase AuthenticationでGoogle認証を実装する - Qiita](https://qiita.com/y-shida1997/items/f5e52c7288813a8184ff)
[Next.js + Firebaseで認証機能実装｜あきな＠旅するプログラマー｜note](https://note.com/akina7/n/na5debd9fa372)

- authProvider作る
  - src/contexts/auth.tsx
- ログイン、新規登録、ログアウトの処理をつくる
  - infrastructure/firebase/auth/sign-in
  - infrastructure/firebase/auth/logout
  - infrastructure/firebase/auth/sign-up
- sign-upページで新規登録ページつくる
  - SignUpPage
- sign-inページでログインページつくる
  - SignInPage
- homeでlogoutボタンつくる
  - index.tsx
- ログインしている、していないでログイン先返る
- チラツキを抑える
