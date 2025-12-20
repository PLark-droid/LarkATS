/**
 * ATS Table Schema Definition
 * Based on the spreadsheet structure from the user's Google Sheets
 */

// Field type constants from Lark Base API
export const FieldType = {
  Text: 1,           // テキスト
  Number: 2,         // 数値
  SingleSelect: 3,   // 単一選択
  MultiSelect: 4,    // 複数選択
  DateTime: 5,       // 日時
  Checkbox: 7,       // チェックボックス
  Person: 11,        // ユーザー
  Phone: 13,         // 電話番号
  URL: 15,           // URL
  Attachment: 17,    // 添付ファイル
  SingleLink: 18,    // リンク（単一）
  Lookup: 19,        // ルックアップ
  Formula: 20,       // 数式
  DuplexLink: 21,    // 双方向リンク
  Location: 22,      // 位置情報
  GroupChat: 23,     // グループチャット
  CreatedTime: 1001, // 作成日時
  ModifiedTime: 1002,// 更新日時
  CreatedUser: 1003, // 作成者
  ModifiedUser: 1004,// 更新者
  AutoNumber: 1005,  // 自動採番
} as const;

// Selection options for dropdown fields
export const SelectionOptions = {
  担当CA名: [
    { name: '道村', color: 0 },
    { name: '紺屋', color: 1 },
  ],
  送客元: [
    { name: 'RDS', color: 0 },
    { name: 'キミナラ', color: 1 },
    { name: '自社', color: 2 },
    { name: '紹介', color: 3 },
  ],
  選考ステップ: [
    { name: '面談', color: 0 },
    { name: '書類選考', color: 1 },
    { name: '一次面接', color: 2 },
    { name: '二次面接', color: 3 },
    { name: '最終面接', color: 4 },
    { name: '内定', color: 5 },
    { name: '入社承諾', color: 6 },
    { name: '入社', color: 7 },
    { name: 'お見送り', color: 8 },
    { name: '辞退', color: 9 },
  ],
  ヨミ: [
    { name: 'A（80%）', color: 0 },
    { name: 'B（50%）', color: 1 },
    { name: 'C（20%）', color: 2 },
    { name: 'ネタ', color: 3 },
  ],
};

// ATS Table Field Definitions
export interface ATSFieldDefinition {
  field_name: string;
  type: number;
  description?: string;
  property?: Record<string, unknown>;
}

export const ATSFields: ATSFieldDefinition[] = [
  {
    field_name: '担当CA名',
    type: FieldType.SingleSelect,
    description: 'キャリアアドバイザーの名前',
    property: {
      options: SelectionOptions.担当CA名,
    },
  },
  {
    field_name: '求職者氏名',
    type: FieldType.Text,
    description: '求職者の氏名',
  },
  {
    field_name: '送客元',
    type: FieldType.SingleSelect,
    description: '紹介元チャネル',
    property: {
      options: SelectionOptions.送客元,
    },
  },
  {
    field_name: '紹介企業名',
    type: FieldType.Text,
    description: '応募先企業名',
  },
  {
    field_name: '選考ステップ',
    type: FieldType.SingleSelect,
    description: '現在の選考進捗状況',
    property: {
      options: SelectionOptions.選考ステップ,
    },
  },
  {
    field_name: 'ヨミ',
    type: FieldType.SingleSelect,
    description: '成約確度',
    property: {
      options: SelectionOptions.ヨミ,
    },
  },
  {
    field_name: 'ネクストアクション',
    type: FieldType.Text,
    description: '次のアクション内容',
  },
  {
    field_name: '初回面談日',
    type: FieldType.DateTime,
    description: '初回面談実施日',
    property: {
      date_formatter: 'yyyy/MM/dd',
    },
  },
  {
    field_name: '入社承諾日',
    type: FieldType.DateTime,
    description: '内定承諾日',
    property: {
      date_formatter: 'yyyy/MM/dd',
    },
  },
  {
    field_name: '入社日',
    type: FieldType.DateTime,
    description: '入社予定日',
    property: {
      date_formatter: 'yyyy/MM/dd',
    },
  },
  {
    field_name: '決定年収',
    type: FieldType.Number,
    description: '決定年収（万円）',
    property: {
      formatter: '0',
    },
  },
  {
    field_name: '現職（企業）',
    type: FieldType.Text,
    description: '現在の勤務先企業名',
  },
  {
    field_name: '現職種',
    type: FieldType.Text,
    description: '現在の職種',
  },
  {
    field_name: '希望職種',
    type: FieldType.Text,
    description: '希望する職種',
  },
];

// Table name
export const ATS_TABLE_NAME = '採用管理（ATS）';
