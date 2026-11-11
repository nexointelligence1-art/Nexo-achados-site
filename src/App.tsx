import { useMemo, useState } from 'react'
import { ArrowDownUp, ArrowRight, BadgeCheck, Check, ChevronDown, Heart, Menu, Search, ShieldCheck, ShoppingBag, SlidersHorizontal, Sparkles, Star, TrendingUp, X } from 'lucide-react'

type Product = {
  id: number
  name: string
  category: string
  price: number
  oldPrice?: number
  rating: number
  reviews: number
  image: string
  tag?: string
  store: string
  colors: string
}

const products: Product[] = [
  { id: 1, name: 'Fone Bluetooth Wave Pro', category: 'Eletrônicos', price: 189.9, oldPrice: 329.9, rating: 4.8, reviews: 2841, image: 'photo-1505740420928-5e560c06d30e', tag: 'MAIS VENDIDO', store: 'Amazon', colors: 'Fone elegante sobre fundo colorido' },
  { id: 2, name: 'Cafeteira italiana Moka', category: 'Casa & cozinha', price: 129.9, oldPrice: 179.9, rating: 4.9, reviews: 1203, image: 'photo-1517668808822-9ebb02f2a0e6', tag: 'ACHADO DO DIA', store: 'Mercado Livre', colors: 'Café sendo servido em uma xícara' },
  { id: 3, name: 'Tênis urbano Cloud Walk', category: 'Moda', price: 219.9, oldPrice: 349.9, rating: 4.7, reviews: 986, image: 'photo-1542291026-7eec264c27ff', store: 'Netshoes', colors: 'Tênis vermelho em fundo branco' },
  { id: 4, name: 'Luminária de mesa Orb', category: 'Casa & cozinha', price: 159.9, oldPrice: 229.9, rating: 4.8, reviews: 642, image: 'photo-1507473885765-e6ed057f782c', tag: 'PREÇO BAIXOU', store: 'Amazon', colors: 'Luminária moderna em uma mesa' },
  { id: 5, name: 'Smartwatch Pulse 3', category: 'Eletrônicos', price: 249.9, oldPrice: 399.9, rating: 4.6, reviews: 1578, image: 'photo-1523275335684-37898b6baf30', store: 'Magalu', colors: 'Relógio de pulso minimalista' },
  { id: 6, name: 'Mochila Everyday 20L', category: 'Moda', price: 179.9, oldPrice: 259.9, rating: 4.9, reviews: 754, image: 'photo-1553062407-98eeb64c6a62', tag: 'QUERIDINHO', store: 'Amazon', colors: 'Mochila preta para o dia a dia' },
  { id: 7, name: 'Câmera instantânea Mini', category: 'Eletrônicos', price: 389.9, oldPrice: 499.9, rating: 4.7, reviews: 432, image: 'photo-1516035069371-29a1b244cc32', store: 'Mercado Livre', colors: 'Câmera fotográfica compacta' },
  { id: 8, name: 'Vaso orgânico em cerâmica', category: 'Casa & cozinha', price: 89.9, oldPrice: 119.9, rating: 4.8, reviews: 318, image: 'photo-1578500494198-246f612d3b3d', store: 'Westwing', colors: 'Vaso decorativo de cerâmica' },
]

const categories = [
  { name: 'Tudo', emoji: '✳' },
  { name: 'Eletrônicos', emoji: '⌁' },
  { name: 'Casa & cozinha', emoji: '⌂' },
  { name: 'Moda', emoji: '◌' },
  { name: 'Beleza', emoji: '✿' },
  { name: 'Esporte', emoji: '↗' },
]

const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const imageUrl = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&q=85`

function App() {
  const [category, setCategory] = useState('Tudo')
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('nexo-favorites') || '[]') as number[] } catch { return [] }
  })
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [sort, setSort] = useState('Recomendados')
  const [mobileMenu, setMobileMenu] = useState(false)

  const toggleFavorite = (id: number) => {
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
      localStorage.setItem('nexo-favorites', JSON.stringify(next))
      return next
    })
  }

  const filtered = useMemo(() => {
    const result = products.filter((product) => {
      const matchesCategory = category === 'Tudo' || product.category === category
      const matchesQuery = `${product.name} ${product.category} ${product.store}`.toLowerCase().includes(query.toLowerCase())
      return matchesCategory && matchesQuery && (!favoritesOnly || favorites.includes(product.id))
    })
    if (sort === 'Menor preço') result.sort((a, b) => a.price - b.price)
    if (sort === 'Maior desconto') result.sort((a, b) => ((b.oldPrice ?? b.price) - b.price) - ((a.oldPrice ?? a.price) - a.price))
    if (sort === 'Melhor avaliados') result.sort((a, b) => b.rating - a.rating)
    return result
  }, [category, query, sort, favorites, favoritesOnly])

  const scrollToDeals = () => document.getElementById('achados')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="site-shell">
      <div className="announcement"><Sparkles size={14} /><span>Curadoria esperta. Compra mais leve.</span><span className="announcement-sep">·</span><span>Novos achados todos os dias</span></div>
      <header className="header">
        <a className="brand" href="#inicio" aria-label="Nexo, início"><span className="brand-mark">n<span>.</span></span><span className="brand-name">nexo</span></a>
        <nav className={`main-nav ${mobileMenu ? 'nav-open' : ''}`} aria-label="Navegação principal">
          <a className="nav-link active" href="#achados" onClick={() => setMobileMenu(false)}>Descobrir</a>
          <a className="nav-link" href="#categorias" onClick={() => setMobileMenu(false)}>Categorias</a>
          <button className={`nav-link favorites-nav ${favoritesOnly ? 'selected' : ''}`} onClick={() => { setFavoritesOnly(!favoritesOnly); scrollToDeals(); setMobileMenu(false) }}><Heart size={16} fill={favoritesOnly ? 'currentColor' : 'none'} /> Favoritos {favorites.length > 0 && <span className="favorite-count">{favorites.length}</span>}</button>
        </nav>
        <div className="header-actions">
          <button className="header-heart" aria-label="Ver favoritos" onClick={() => { setFavoritesOnly(!favoritesOnly); scrollToDeals() }}><Heart size={19} /><span>{favorites.length}</span></button>
          <button className="mobile-toggle" aria-label="Abrir menu" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X /> : <Menu />}</button>
        </div>
      </header>

      <main id="inicio">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> A internet tem muita coisa. A gente filtra.</div>
            <h1>Seu próximo<br />bom achado <span>tá aqui<span className="title-dot">.</span></span></h1>
            <p className="hero-description">Produtos que valem a pena, selecionados por gente de verdade. Sem caça ao tesouro — só boas escolhas.</p>
            <div className="hero-actions"><button className="button-primary" onClick={scrollToDeals}>Explorar achados <ArrowRight size={17} /></button><div className="social-proof"><div className="avatar-stack"><span>J</span><span>M</span><span>A</span><span>+</span></div><div><strong>10 mil+</strong><small>pessoas economizando</small></div></div></div>
            <div className="hero-footnote"><ShieldCheck size={15} /> Achados selecionados. Compra segura direto na loja.</div>
          </div>
          <div className="hero-art" aria-label="Seleção de produtos em destaque">
            <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
            <div className="hero-photo"><img src={imageUrl('photo-1490312278390-ab64016e0aa9')} alt="Ambiente acolhedor com design contemporâneo" /><div className="photo-shade" /></div>
            <div className="hero-sticker"><span>ACHADO<br />DA SEMANA</span><Sparkles size={18} /></div>
            <div className="floating-card price-float"><span className="float-icon"><TrendingUp size={17} /></span><span><small>Tá valendo muito</small><strong>até 40% OFF</strong></span></div>
            <div className="floating-card community-float"><span className="community-icon"><Heart size={17} fill="currentColor" /></span><span><small>A comunidade amou</small><strong>4.9 <Star size={12} fill="currentColor" /></strong></span></div>
            <div className="hero-caption"><span className="caption-line" /><span>Pequenos achados, grandes favoritos.</span></div>
          </div>
          <div className="hero-decor decor-a">✳</div><div className="hero-decor decor-b">✦</div>
        </section>

        <section className="trust-strip" aria-label="Por que comprar com a Nexo">
          <div className="trust-item"><span className="trust-icon mint"><BadgeCheck size={19} /></span><span><strong>Curadoria de verdade</strong><small>Sem produto aleatório por aqui</small></span></div>
          <span className="trust-divider" />
          <div className="trust-item"><span className="trust-icon peach"><ArrowDownUp size={18} /></span><span><strong>Preço que faz sentido</strong><small>A gente compara pra você</small></span></div>
          <span className="trust-divider" />
          <div className="trust-item"><span className="trust-icon lavender"><ShieldCheck size={18} /></span><span><strong>Compra sem susto</strong><small>Você compra direto na loja</small></span></div>
          <div className="trust-note"><span className="live-dot" /> atualizado hoje</div>
        </section>

        <section className="catalog-section" id="achados">
          <div className="section-heading"><div><div className="section-kicker">A gente garimpou pra você</div><h2>Achados que <span>valem o clique.</span></h2><p>Boas descobertas, preços honestos e aquele “era isso que eu precisava”.</p></div><button className={`saved-button ${favoritesOnly ? 'saved-active' : ''}`} onClick={() => setFavoritesOnly(!favoritesOnly)}><Heart size={16} fill={favoritesOnly ? 'currentColor' : 'none'} /> {favoritesOnly ? 'Ver todos' : 'Meus favoritos'} <span>{favorites.length}</span></button></div>
          <div className="catalog-toolbar" id="categorias">
            <div className="category-list" role="tablist" aria-label="Categorias de produtos">{categories.map((item) => <button key={item.name} role="tab" aria-selected={category === item.name} className={`category-chip ${category === item.name ? 'category-active' : ''}`} onClick={() => { setCategory(item.name); setFavoritesOnly(false) }}><span>{item.emoji}</span>{item.name}</button>)}</div>
            <div className="toolbar-controls"><label className="search-box"><Search size={16} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="O que você procura?" aria-label="Buscar produtos" />{query && <button aria-label="Limpar busca" onClick={() => setQuery('')}><X size={14} /></button>}</label><label className="sort-box"><SlidersHorizontal size={15} /><select aria-label="Ordenar produtos" value={sort} onChange={(event) => setSort(event.target.value)}><option>Recomendados</option><option>Menor preço</option><option>Maior desconto</option><option>Melhor avaliados</option></select><ChevronDown size={14} /></label></div>
          </div>
          <div className="results-line"><span>{favoritesOnly ? 'SEUS FAVORITOS' : 'SELECIONADOS PRA VOCÊ'}</span><span>{filtered.length} {filtered.length === 1 ? 'achado' : 'achados'}</span></div>
          {filtered.length > 0 ? <div className="product-grid">{filtered.map((product) => {
            const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0
            const favorite = favorites.includes(product.id)
            return <article className="product-card" key={product.id}><div className="product-image-wrap"><img className="product-image" src={imageUrl(product.image)} alt={product.colors} loading="lazy" />{product.tag && <span className="product-tag">{product.tag}</span>}<button className={`heart-button ${favorite ? 'heart-active' : ''}`} aria-label={favorite ? `Remover ${product.name} dos favoritos` : `Adicionar ${product.name} aos favoritos`} onClick={() => toggleFavorite(product.id)}><Heart size={17} fill={favorite ? 'currentColor' : 'none'} /></button><span className="discount-badge">-{discount}%</span></div><div className="product-info"><div className="product-meta"><span>{product.category}</span><span className="rating"><Star size={12} fill="currentColor" /> {product.rating} <small>({product.reviews.toLocaleString('pt-BR')})</small></span></div><h3>{product.name}</h3><div className="old-price">{money(product.oldPrice ?? product.price)}</div><div className="price-line"><strong>{money(product.price)}</strong><span>no Pix</span></div><div className="installments">ou 3x de {money(product.price / 3)} sem juros</div><div className="product-bottom"><span className="store-name"><span className="store-dot" /> {product.store}</span><a className="buy-button" href={`https://www.google.com/search?q=${encodeURIComponent(`${product.name} ${product.store}`)}`} target="_blank" rel="noreferrer" aria-label={`Buscar ${product.name} na loja ${product.store}`}>Ver achado <ArrowRight size={14} /></a></div></div></article>
          })}</div> : <div className="empty-state"><span className="empty-icon"><Search size={22} /></span><h3>Nenhum achado por aqui (ainda).</h3><p>Tente outra busca ou escolha uma categoria diferente.</p><button className="button-primary" onClick={() => { setQuery(''); setCategory('Tudo'); setFavoritesOnly(false) }}>Ver todos os achados <ArrowRight size={16} /></button></div>}
          <div className="catalog-footer"><span><Check size={14} /> Preços e disponibilidade podem mudar na loja.</span><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>De volta ao topo <ArrowRight size={14} /></button></div>
        </section>

        <section className="newsletter"><div className="newsletter-spark">✳</div><div className="newsletter-copy"><span className="newsletter-label">Uma boa dica nunca é demais</span><h2>Achados bons, direto<br />no seu radar.</h2><p>As descobertas mais legais da semana. Sem spam, sem enrolação.</p></div><form className="newsletter-form" onSubmit={(event) => { event.preventDefault(); alert('Boa! Você entrou para a lista de achados Nexo.') }}><label htmlFor="email">Seu melhor e-mail</label><div className="email-field"><input id="email" type="email" placeholder="voce@email.com" required /><button type="submit" aria-label="Cadastrar e-mail"><ArrowRight size={18} /></button></div><small>Ao se cadastrar, você concorda em receber novidades Nexo.</small></form><div className="newsletter-decoration">n<span>.</span></div></section>
      </main>

      <footer className="footer"><a className="brand footer-brand" href="#inicio"><span className="brand-mark">n<span>.</span></span><span className="brand-name">nexo</span></a><p>Boas descobertas fazem o dia melhor.</p><div className="footer-right"><span>Feito pra encontrar. Bom pra levar.</span><span className="footer-copyright">© {new Date().getFullYear()} Nexo Achados</span></div></footer>
      <div className="affiliate-note"><ShoppingBag size={13} /> Alguns links podem gerar comissão pra gente — sem custo extra pra você.</div>
    </div>
  )
}

export default App
