# PCA Database Discord Bot

![PCA Database Discord Bot Logo](https://i.imgur.com/jyqYHbm.png)

---

## 概要

PCA Database Discord Bot は、複数の Discord サーバーで利用可能な警察向けボットです。  
サーバーごとに任意の Google スプレッドシートを設定し、`/wanted` コマンドで指名手配情報を記録します。  
記録先はスプレッドシートIDとシート名（デフォルトは `wanted`）を自由に変更可能です。

---

## 主な機能

- **/wanted**  
  指名手配情報を登録。罪状に応じて罰金額を自動計算し、指定スプレッドシートに記録します。

- **/set_spreadsheet**  
  このサーバーで使用する Google スプレッドシートIDとシート名を設定します。

- **/setup_help**  
  Google スプレッドシートのセットアップ方法を表示します。

- **/help_pd**  
  利用可能なコマンド一覧を表示します。

- **/read_readmefile**  
  ボットの README ファイルのリンクを表示します。

---

## 使い方

1. Google スプレッドシートを作成してください。  
2. Bot のサービスアカウント（JSON の `client_email`）に「編集者」権限を付与してください。  
3. Discord サーバー内で `/set_spreadsheet` コマンドを使い、スプレッドシートIDとシート名を設定してください。  
4. `/wanted` コマンドで指名手配情報を登録すると、設定したスプレッドシートに自動で記録されます。

---

## 技術スタック

- Node.js  
- Discord.js (v14)  
- Google Sheets API (`google-spreadsheet`パッケージ)  
- Supabase (設定管理用 PostgreSQL データベース)  
- Koyeb (ホスティング)  

---

## Supabase テーブル構造

| カラム名        | 型           | 説明                             |
|-----------------|--------------|---------------------------------|
| id              | UUID         | プライマリキー、自動生成        |
| guild_id        | TEXT         | Discord サーバーID              |
| spreadsheet_id  | TEXT         | Google スプレッドシートID       |
| sheet_name      | TEXT         | 使用するシート名 (例: "wanted") |
| created_at      | TIMESTAMP    | レコード作成日時                |

---

## セットアップ手順

1. リポジトリをクローン  
2. `.env` ファイルを作成し、以下の環境変数を設定  
   - `DISCORD_TOKEN`  
   - `CLIENT_ID`  
   - `SUPABASE_URL`  
   - `SUPABASE_KEY`  
   - `SPREADSHEET_KEYFILE` (GoogleサービスアカウントJSONファイル名)  
3. 依存パッケージをインストール  
   ```bash
   npm install

---

## 注意事項

- サービスアカウントの JSON は Git 管理外にしてください（`.gitignore` に記載推奨）。  
- Google スプレッドシートのシート名は設定したものを正しく入力してください（デフォルトは `wanted`）。  
- Supabase テーブルに設定情報がない場合、`/wanted` は動作しません。必ず先に `/set_spreadsheet` を実行してください。  

---

## ロゴ画像について

![PCA Database Discord Bot Logo](https://i.imgur.com/a8CbHqL.png)

画像は Imgur にアップロードされています。  
長期利用を考慮する場合は、GitHubリポジトリに直接アップロードしURLを更新してください。

---

## ライセンス

MIT License

---

## 作者

とまと

---

ご質問や不具合報告は GitHub Issues または Discord サーバーまでお願いします。
