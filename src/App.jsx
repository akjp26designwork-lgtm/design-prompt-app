import { useState } from 'react'
import './App.css'

const PURPOSE_OPTIONS = [
  '新しいお客さんを集めたい', '知ってもらいたい', '購入してもらいたい',
  'イベント・告知したい', '一度見た人に再アプローチ', 'ブランドイメージを上げたい',
]
const PLACEMENT_OPTIONS = [
  'Instagram', 'LINE', 'X（Twitter）', 'チラシ・印刷物',
]
const MOOD_OPTIONS = [
  'シンプル・すっきり', '高級感・おしゃれ', '親しみやすい・やさしい', '力強い・インパクト重視', 'ナチュラル・やわらか',
]
const FONT_OPTIONS = [
  '明朝・セリフ系', 'ゴシック・サンセリフ系', '丸ゴシック系', '太め・インパクト重視', '手書き・筆記体風', 'AIにおまかせ',
]
const TEXT_STYLE_OPTIONS = [
  'キャッチコピーを超大きく', '見出し大きめ・バランスよく', '文字複数・情報量多め', '文字少なく・ビジュアル重視', 'AIにおまかせ',
]
const PERSON_OPTIONS = ['入れる（男性）', '入れる（女性）', '入れる（性別問わず）', '入れない', 'AIにおまかせ']

const INIT = {
  purpose: [], placement: [], size: '', format: 'PNG（画質重視・SNSやWeb向け）',
  productName: '', serviceDescription: '', benefits: '', priceInfo: '',
  targetAge: '', targetProblem: '', desiredFeeling: '',
  aiCopy: false, catchphrase: '', subcopy: '', cta: '', requiredText: '',
  mood: [], mainColor: '', avoidColor: '', font: [], textStyle: [],
  includePerson: '', referenceUrl: '', avoidDesign: '',
}

const STEPS = [
  { id: 1, title: '何のデザイン？' },
  { id: 2, title: '商品・お客さん' },
  { id: 3, title: 'デザインの言葉' },
  { id: 4, title: 'デザインの雰囲気' },
]

function multi(arr, v) { return arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v] }
function single(arr, v) { return arr.includes(v) ? [] : [v] }

function isValid(step, f) {
  if (step === 1) return f.purpose.length > 0 && f.placement.length > 0
  if (step === 2) return !!(f.productName && f.serviceDescription && f.benefits && f.targetAge && f.targetProblem)
  if (step === 3) return !!(f.cta && (f.aiCopy || f.catchphrase))
  if (step === 4) return f.mood.length > 0 && !!f.mainColor && f.font.length > 0 && f.textStyle.length > 0
  return true
}

function buildPrompt(f) {
  const L = []

  L.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  L.push('【 AI画像生成プロンプト（高品質版）】')
  L.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  L.push('')

  L.push('■ 制作物の定義')
  L.push(`・用途：${f.placement.join('、')}に掲載する${f.purpose.join('、')}のための広告バナー`)
  if (f.size) L.push(`・サイズ：${f.size}`)
  L.push(`・ファイル形式：${f.format}`)
  L.push(`・品質：SNS掲載レベルの高解像度・プロクオリティ`)
  L.push('')

  L.push('■ ビジュアルスタイル（最重要）')
  L.push(`・全体の雰囲気：${f.mood.join('、')}`)
  L.push(`・メインカラー：${f.mainColor}を基調としたカラーパレット`)
  if (f.avoidColor) L.push(`・使用禁止カラー：${f.avoidColor}`)
  L.push(`・フォントスタイル：${f.font.join('、')}`)
  L.push(`・文字レイアウト：${f.textStyle.join('、')}`)
  if (f.includePerson && f.includePerson !== '入れない') {
    L.push(`・人物：${f.includePerson}を自然な形で配置。プロのカメラマンが撮影したような高品質な写真風`)
  } else {
    L.push('・人物：なし。商品・サービスを象徴するビジュアル要素で構成')
  }
  L.push('')

  L.push('■ 構図・レイアウト指示')
  L.push('・構図：三分割法を意識したバランスの良いレイアウト')
  L.push('・テキストエリア：視認性を確保した十分な余白を設ける')
  L.push('・視線誘導：キャッチコピー → サブコピー → CTAボタンの順に自然に視線が流れるデザイン')
  L.push('・背景：メインカラーに馴染む自然なグラデーションまたは写真背景')
  L.push('')

  L.push('■ テキスト要素（デザインに含めること）')
  if (f.aiCopy) {
    L.push(`・キャッチコピー：「${f.productName}」の魅力を最大限に伝える印象的なコピーをAIが考えて配置`)
    L.push('・サブコピー：キャッチコピーを補足する簡潔な説明文')
  } else {
    if (f.catchphrase) L.push(`・キャッチコピー（メイン・最大フォント）：「${f.catchphrase}」`)
    if (f.subcopy) L.push(`・サブコピー：「${f.subcopy}」`)
  }
  L.push(`・CTAボタン：「${f.cta}」を目立つボタンデザインで配置`)
  if (f.requiredText) L.push(`・必須テキスト：${f.requiredText}`)
  L.push('')

  L.push('■ 商品・サービス情報（デザインに反映）')
  L.push(`・商品名：${f.productName}`)
  L.push(`・サービス概要：${f.serviceDescription}`)
  L.push(`・ターゲット：${f.targetAge}、悩み「${f.targetProblem}」を持つ人`)
  L.push(`・訴求ポイント：${f.benefits}`)
  if (f.priceInfo) L.push(`・価格・実績・キャンペーン情報：${f.priceInfo}（デザインに目立つ形で含める）`)
  if (f.desiredFeeling) L.push(`・見た人に感じてほしいこと：${f.desiredFeeling}`)
  L.push('')

  if (f.referenceUrl || f.avoidDesign) {
    L.push('■ 参考・禁止事項')
    if (f.referenceUrl) L.push(`・参考スタイル：${f.referenceUrl}`)
    if (f.avoidDesign) L.push(`・禁止デザイン：${f.avoidDesign}`)
    L.push('')
  }

  L.push('■ 品質・仕上げ指示')
  L.push('・解像度：SNS掲載に適した高解像度（300dpi相当）')
  L.push('・仕上がり：プロのデザイナーが制作したような完成度')
  L.push('・文字の可読性：背景とのコントラストを確保し、すべてのテキストをはっきり読めるようにする')
  L.push('・全体的な印象：チープに見えない、信頼感と訴求力を両立したデザイン')
  L.push('')

  L.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  L.push('【 ChatGPT / Gemini への指示 】')
  L.push('上記の内容をもとに以下を日本語で生成してください：')
  L.push('1. 上記条件を満たす高品質な広告バナーの画像を生成する')
  L.push('2. キャッチコピー案を3パターン提案する（各20文字以内）')
  L.push('3. 改善提案があれば教えてください')
  L.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  return L.join('\n')
}

function Field({ label, required, hint, children }) {
  return (
    <div className="field">
      <div className="field-label">
        <span>{label}</span>
        {required && <span className="req-badge">必須</span>}
      </div>
      {hint && <p className="field-hint">{hint}</p>}
      {children}
    </div>
  )
}

function Chips({ options, selected, onToggle }) {
  return (
    <div className="chips">
      {options.map(o => (
        <button
          key={o} type="button"
          className={`chip${selected.includes(o) ? ' chip--on' : ''}`}
          onClick={() => onToggle(o)}
        >{o}</button>
      ))}
    </div>
  )
}

function Step1({ f, set }) {
  const PLACEMENT_SIZE = {
    'Instagram': '正方形：1080px ×1350px',
    'LINE': '縦長：1080px × 1920px',
    'X（Twitter）': '横長：1200px × 675px',
    'チラシ・印刷物': 'A4サイズ（210mm × 297mm）',
  }

  const handlePlacementToggle = (v) => {
    const newPlacement = single(f.placement, v)
    const newSize = newPlacement.length > 0 ? (PLACEMENT_SIZE[newPlacement[0]] ?? '') : ''
    set({ placement: newPlacement, size: newSize })
  }

  return (
    <div className="fields">
      <Field label="このデザインで何をしたいですか？" required>
        <Chips options={PURPOSE_OPTIONS} selected={f.purpose} onToggle={v => set({ purpose: single(f.purpose, v) })} />
      </Field>
      <Field label="どこに載せますか？" required>
        <Chips options={PLACEMENT_OPTIONS} selected={f.placement} onToggle={handlePlacementToggle} />
      </Field>
      <Field label="デザインのサイズ">
        <input className="inp" type="text" placeholder="例：縦1080px　横1080px" value={f.size} onChange={e => set({ size: e.target.value })} />
      </Field>
      <Field label="ファイル形式">
        <select className="sel" value={f.format} onChange={e => set({ format: e.target.value })}>
          <option>PNG（画質重視・SNSやWeb向け）</option>
          <option>JPG（データ軽量・メール添付向け）</option>
          <option>PDF（印刷・チラシ向け）</option>
        </select>
        <p style={{fontSize: '13px', color: '#8B6F5E', marginTop: '8px', lineHeight: '1.6', padding: '10px 12px', background: '#FFF0E8', borderRadius: '8px', borderLeft: '3px solid #FF9969'}}>
          💡 迷ったらSNS・Webは「PNG」、印刷・チラシは「PDF」がおすすめです
        </p>
      </Field>
    </div>
  )
}

function Step2({ f, set }) {
  return (
    <div className="fields">
      <Field label="商品名・サービス名" required>
        <input className="inp" type="text" placeholder="例：鈴木整骨院・ハンドメイドアクセサリーBOXY" value={f.productName} onChange={e => set({ productName: e.target.value })} />
      </Field>
      <Field label="どんなお店・サービスですか？（一言で）" required>
        <input className="inp" type="text" placeholder="例：毎日使える保湿スキンケアセット" value={f.serviceDescription} onChange={e => set({ serviceDescription: e.target.value })} />
      </Field>
      <Field label="お客さんにどんないいことがありますか？" required>
        <textarea className="inp ta" rows={3} placeholder="例：乾燥が改善され、肌がもちもちになる。毎朝のスキンケアが楽しくなる" value={f.benefits} onChange={e => set({ benefits: e.target.value })} />
      </Field>
      <Field label="価格・実績・キャンペーン（あれば）">
        <input className="inp" type="text" placeholder="例：初回限定50%OFF・累計10万個販売" value={f.priceInfo} onChange={e => set({ priceInfo: e.target.value })} />
      </Field>
      <Field label="どんな人に届けたいですか？（年齢・性別など）" required>
        <input className="inp" type="text" placeholder="例：30〜40代女性" value={f.targetAge} onChange={e => set({ targetAge: e.target.value })} />
      </Field>
      <Field label="その人はどんな悩みを持っていますか？" required>
        <input className="inp" type="text" placeholder="例：乾燥・毛穴の開き・くすみが気になる" value={f.targetProblem} onChange={e => set({ targetProblem: e.target.value })} />
      </Field>
      <Field label="デザインを見た人にどう感じてほしいですか？（任意）">
        <input className="inp" type="text" placeholder="例：試してみたい！自分も使えばよかった" value={f.desiredFeeling} onChange={e => set({ desiredFeeling: e.target.value })} />
      </Field>
    </div>
  )
}

function Step3({ f, set }) {
  return (
    <div className="fields">
      <Field label="文章はAIに考えてもらう" hint="オンにするとキャッチコピーとサブコピーをAIが生成します">
        <div className="toggle-row">
          <span className="toggle-lbl">{f.aiCopy ? 'AIにおまかせ（ON）' : '自分で入力する'}</span>
          <button
            type="button"
            className={`toggle${f.aiCopy ? ' toggle--on' : ''}`}
            onClick={() => set({ aiCopy: !f.aiCopy })}
            aria-label="AIにおまかせ切り替え"
          >
            <span className="toggle-knob" />
          </button>
        </div>
      </Field>
      <Field label="一番大きく載せたい言葉（キャッチコピー）" required={!f.aiCopy}>
        <input className="inp" type="text"
          placeholder={f.aiCopy ? 'AIが生成します' : '例：乾燥に悩む肌へ、ひとつの答え。'}
          value={f.catchphrase} disabled={f.aiCopy}
          onChange={e => set({ catchphrase: e.target.value })} />
      </Field>
      <Field label="その下に載せる補足の言葉（任意）">
        <input className="inp" type="text"
          placeholder={f.aiCopy ? 'AIが生成します' : '例：365日、うるおいつづく処方。'}
          value={f.subcopy} disabled={f.aiCopy}
          onChange={e => set({ subcopy: e.target.value })} />
      </Field>
      <Field label="行動を促す言葉（例：今すぐ予約・詳しくはこちら）" required>
        <input className="inp" type="text" placeholder="例：今すぐ試す・詳しくはこちら・無料で相談する" value={f.cta} onChange={e => set({ cta: e.target.value })} />
      </Field>
      <Field label="必ず載せたい情報（住所・電話番号など）（任意）">
        <input className="inp" type="text" placeholder="例：公式サイトURL・ハッシュタグ・注意書き" value={f.requiredText} onChange={e => set({ requiredText: e.target.value })} />
      </Field>
    </div>
  )
}

function Step4({ f, set, onGenerate, prompt, canGen }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try { await navigator.clipboard.writeText(prompt) } catch { return }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fields">
      <Field label="どんな雰囲気にしたいですか？" required>
        <Chips options={MOOD_OPTIONS} selected={f.mood} onToggle={v => set({ mood: single(f.mood, v) })} />
      </Field>
      <Field label="使いたい色（例：ピンク系・青系・ブランドカラーなど）" required>
        <input className="inp" type="text" placeholder="例：ラベンダーパープル・#E8D5FF・ホワイトベース" value={f.mainColor} onChange={e => set({ mainColor: e.target.value })} />
      </Field>
      <Field label="使いたくない色があれば（任意）">
        <input className="inp" type="text" placeholder="例：赤・黒・原色系" value={f.avoidColor} onChange={e => set({ avoidColor: e.target.value })} />
      </Field>
      <Field label="文字のスタイル（迷ったらAIにおまかせでOK）" required>
        <Chips options={FONT_OPTIONS} selected={f.font} onToggle={v => set({ font: single(f.font, v) })} />
      </Field>
      <Field label="文字のレイアウト（迷ったらAIにおまかせでOK）" required>
        <Chips options={TEXT_STYLE_OPTIONS} selected={f.textStyle} onToggle={v => set({ textStyle: single(f.textStyle, v) })} />
      </Field>
      <Field label="画像に人物を入れるか">
        <select className="sel" value={f.includePerson} onChange={e => set({ includePerson: e.target.value })}>
          <option value="">選択してください</option>
          {PERSON_OPTIONS.map(o => <option key={o}>{o}</option>)}
        </select>
      </Field>
      <Field label="参考にしたいデザインのURL・イメージ（任意）">
        <input className="inp" type="text" placeholder="例：https://... / ミニマルで白基調のECサイト風" value={f.referenceUrl} onChange={e => set({ referenceUrl: e.target.value })} />
        <p style={{fontSize: '13px', color: '#8B6F5E', marginTop: '8px', lineHeight: '1.6', padding: '10px 12px', background: '#FFF0E8', borderRadius: '8px', borderLeft: '3px solid #FF9969'}}>
          💡 プロンプト生成後、参考画像をChatGPTまたはGeminiにも一緒にアップロードすると、より精度の高い画像が生成されます。
        </p>
      </Field>
      <Field label="こんなデザインは嫌、というものがあれば（任意）">
        <input className="inp" type="text" placeholder="例：賑やかすぎる・ポップすぎる・文字が多すぎる" value={f.avoidDesign} onChange={e => set({ avoidDesign: e.target.value })} />
      </Field>

      <button
        type="button"
        className={`gen-btn${canGen ? '' : ' gen-btn--off'}`}
        onClick={onGenerate}
        disabled={!canGen}
      >
        ✨ プロンプトを生成する
      </button>
      {!canGen && (
        <p className="gen-hint">雰囲気・メインカラー・フォント・文字の見せ方を選択してください</p>
      )}

      {prompt && (
        <div className="result">
          <div className="result-head">
            <span className="result-title">✅ 生成されたプロンプト</span>
            <button type="button" className="copy-btn" onClick={copy}>
              {copied ? '✓ コピー済み！' : '📋 全文コピー'}
            </button>
          </div>
          <p className="result-usage">💡 使い方：上のプロンプトをコピーして、ChatGPTまたはGeminiのテキスト入力欄に貼り付けてください。参考画像がある場合は画像も一緒にアップロードすると、より精度の高い提案が得られます。</p>
          <pre className="result-body">{prompt}</pre>
          <div className="tool-links">
            <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer" className="tool-link chatgpt-link">
              💬 ChatGPTで開く
            </a>
            <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" className="tool-link gemini-link">
              ✨ Geminiで開く
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [step, setStep] = useState(1)
  const [f, setF] = useState(INIT)
  const [prompt, setPrompt] = useState('')

  const update = patch => setF(prev => ({ ...prev, ...patch }))
  const valid = isValid(step, f)

  const next = () => { if (valid) setStep(s => Math.min(s + 1, 4)) }
  const prev = () => setStep(s => Math.max(s - 1, 1))

  const generate = () => {
    setPrompt(buildPrompt(f))
    setTimeout(() => {
      document.querySelector('.result')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  return (
    <div className="app">
      <header className="hdr">
        <h1 className="hdr-title">✏️ デザインプロンプトジェネレーター</h1>
        <p className="hdr-sub">AI画像生成ツール用のプロンプトを4ステップで作成</p>
      </header>

      <main className="main">
        <div className="card">
          <nav className="tab-nav">
            {STEPS.map(s => (
              <button
                key={s.id} type="button"
                className={`tab${step === s.id ? ' tab--active' : ''}${step > s.id ? ' tab--done' : ''}`}
                onClick={() => { if (s.id <= step) setStep(s.id) }}
              >
                <span className="tab-num">STEP {s.id}</span>
                <span className="tab-lbl">{s.title}</span>
              </button>
            ))}
          </nav>

          <div className="prog-track">
            <div className="prog-fill" style={{ width: `${(step / 4) * 100}%` }} />
          </div>

          <div className="body">
            <div className="step-head">
              <span className="step-pill">STEP {step}</span>
              <h2 className="step-ttl">{STEPS[step - 1].title}</h2>
            </div>

            {step === 1 && <Step1 f={f} set={update} />}
            {step === 2 && <Step2 f={f} set={update} />}
            {step === 3 && <Step3 f={f} set={update} />}
            {step === 4 && <Step4 f={f} set={update} onGenerate={generate} prompt={prompt} canGen={isValid(4, f)} />}

            <div className="nav-row">
              {step > 1 && (
                <button type="button" className="btn-sec" onClick={prev}>← 前へ</button>
              )}
              {step < 4 && (
                <button
                  type="button"
                  className={`btn-pri${valid ? '' : ' btn-pri--off'}`}
                  onClick={next}
                  disabled={!valid}
                >
                  次へ →
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="ftr">
        <p>スズキローカルデザイン AI×デザイン実践アプリ</p>
      </footer>
    </div>
  )
}
