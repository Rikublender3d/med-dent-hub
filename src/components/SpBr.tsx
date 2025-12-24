/**
 * スマートフォン表示時のみ改行するコンポーネント
 * md（768px）以上では非表示になる
 */
export default function SpBr() {
  return <br className="block md:hidden" />
}
