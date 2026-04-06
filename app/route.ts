import { getPayload } from 'payload'
import config from '../payload.config'
import { readFileSync } from 'fs'
import path from 'path'

// Always render at request time — no DB connection available at build
export const dynamic = 'force-dynamic'

function esc(str: string | null | undefined): string {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Use fallback if CMS value is empty
function val(cms: string | null | undefined, fallback: string): string {
  return cms ? esc(cms) : fallback
}

export async function GET() {
  const payload = await getPayload({ config })

  const [meta, nav, hero, about, fresho, delivery, mission, env, commitment, contact, footer, testimonialRes] =
    await Promise.all([
      payload.findGlobal({ slug: 'meta' }),
      payload.findGlobal({ slug: 'navigation' }),
      payload.findGlobal({ slug: 'hero' }),
      payload.findGlobal({ slug: 'about' }),
      payload.findGlobal({ slug: 'fresho' }),
      payload.findGlobal({ slug: 'delivery' }),
      payload.findGlobal({ slug: 'mission' }),
      payload.findGlobal({ slug: 'environment' }),
      payload.findGlobal({ slug: 'commitment' }),
      payload.findGlobal({ slug: 'contact' }),
      payload.findGlobal({ slug: 'footer' }),
      payload.find({ collection: 'testimonials', sort: 'order', limit: 100 }),
    ])

  const h  = hero        as any
  const n  = nav         as any
  const a  = about       as any
  const fr = fresho      as any
  const d  = delivery    as any
  const m  = mission     as any
  const e  = env         as any
  const co = commitment  as any
  const ct = contact     as any
  const fo = footer      as any
  const mt = meta        as any
  const testimonials = testimonialRes.docs as any[]

  // ── Build array HTML blocks ───────────────────────────────────────

  const deliveryBullets = ((d?.bulletPoints as any[]) || [])
    .map(b => `
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span>${esc(b.text)}</span>
            </li>`)
    .join('')

  const missionItems = ((m?.missionListItems as any[]) || [])
    .map(i => `<li>${esc(i.text)}</li>`).join('')

  const guidingPrinciples = ((m?.guidingPrinciples as any[]) || [])
    .map(p => `<span class="commitment-value">${esc(p.label)}</span>`).join('')

  const starSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="#9AC92C" aria-hidden="true"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`

  const testimonialCards = testimonials
    .map(t => `
            <div class="testimonial-card">
              <div class="testimonial-stars" aria-label="${t.stars} out of 5 stars">
                ${starSvg.repeat(Math.min(5, Math.max(1, t.stars || 5)))}
              </div>
              <blockquote class="testimonial-card-text">"${esc(t.quote)}"</blockquote>
              <div class="testimonial-card-author"><strong>${esc(t.author)}</strong></div>
            </div>`)
    .join('')

  const envCards = ((e?.cards as any[]) || [])
    .map(c => `
          <div class="env-card reveal">
            <h3>${esc(c.title)}</h3>
            <p>${esc(c.body)}</p>
          </div>`).join('')

  const envStats = ((e?.stats as any[]) || [])
    .map(s => `
          <div class="env-stat">
            <div class="env-stat-num">${esc(s.number)}</div>
            <div class="env-stat-label">${esc(s.label)}</div>
          </div>`).join('')

  const policyLinks = ((e?.policyDocs as any[]) || [])
    .map(p => `
          <a href="${esc(p.url)}" target="_blank" rel="noopener" class="env-policy-link">${esc(p.label)}</a>`)
    .join('')

  const valuePills = ((co?.valuePills as any[]) || [])
    .map(v => `<span class="commitment-value">${esc(v.label)}</span>`).join('')

  const awards = ((a?.awards as any[]) || [])
    .map(aw => `
                <li style="display:flex;align-items:flex-start;gap:0.6rem;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2.5" stroke-linecap="round" style="flex-shrink:0;margin-top:2px" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  ${esc(aw.text)}
                </li>`).join('')

  const pillars = ((a?.pillars as any[]) || [])
    .map(p => `
              <div class="pillar tilt-card">
                <strong>${esc(p.title)}</strong>
                <p>${esc(p.description)}</p>
              </div>`).join('')

  const certItems = ((fo?.certItems as any[]) || [])
    .map(c => `<li style="padding-bottom:0.6rem;border-bottom:1px solid rgba(255,255,255,0.25);">${esc(c.text)}</li>`)
    .join('')

  // ── Token map ─────────────────────────────────────────────────────
  const tokens: Record<string, string> = {
    // Meta
    '{{meta.title}}':       val(mt?.title, 'AMJ Produce | Premium Wholesale Fresh Produce – South Australia'),
    '{{meta.description}}': val(mt?.description, 'Premium wholesale fresh produce supplier in South Australia.'),
    // Navigation
    '{{nav.wholesale}}':    val(n?.wholesaleLabel, 'Wholesale'),
    '{{nav.aboutAmj}}':     val(n?.aboutLabel, 'About AMJ'),
    '{{nav.products}}':     val(n?.productsLabel, 'Products'),
    '{{nav.media}}':        val(n?.mediaLabel, 'Media'),
    '{{nav.environment}}':  val(n?.environmentLabel, 'Environment'),
    '{{nav.contact}}':      val(n?.contactLabel, 'Contact'),
    '{{nav.marketReport}}': val(n?.marketReportLabel, 'Market Report'),
    // Hero
    '{{hero.eyebrow}}':    val(h?.eyebrow, "South Australia's Premium Wholesaler"),
    '{{hero.titleLine1}}': val(h?.titleLine1, 'Premium Wholesale'),
    '{{hero.titleLine2}}': val(h?.titleLine2, 'Fresh Produce'),
    '{{hero.sub}}':        val(h?.subParagraph, 'Delivering the finest local and specialty produce to chefs, restaurants, caterers, and corporate kitchens across South Australia.'),
    '{{hero.cta1}}':       val(h?.ctaPrimaryLabel, 'View Our Produce'),
    '{{hero.cta2}}':       val(h?.ctaOutlineLabel, 'Enquire Now'),
    // About
    '{{about.sectionLabel}}': val(a?.sectionLabel, 'About Us'),
    '{{about.heading}}':      val(a?.heading, "South Australia's Trusted Fresh Produce Partner"),
    '{{about.lead}}':         val(a?.leadParagraph, ''),
    '{{about.body1}}':        val(a?.body1, ''),
    '{{about.body2}}':        val(a?.body2, ''),
    '{{about.body3}}':        val(a?.body3, ''),
    '{{about.cta}}':          val(a?.ctaLabel, 'Get in Touch'),
    '{{about.awards}}':       awards,
    '{{about.pillars}}':      pillars,
    // Fresho
    '{{fresho.sectionLabel}}': val(fr?.sectionLabel, 'Online Ordering'),
    '{{fresho.heading}}':      val(fr?.heading, 'Order Fresh Produce Through Fresho'),
    '{{fresho.body}}':         val(fr?.body, ''),
    '{{fresho.buttonLabel}}':  val(fr?.buttonLabel, 'Order on Fresho'),
    '{{fresho.buttonUrl}}':    fr?.buttonUrl || 'https://www.fresho.com/au',
    // Delivery
    '{{delivery.sectionLabel}}': val(d?.sectionLabel, 'Logistics'),
    '{{delivery.heading}}':      val(d?.heading, 'From Our Hands to Your Kitchen'),
    '{{delivery.lead}}':         val(d?.leadParagraph, ''),
    '{{delivery.bullets}}':      deliveryBullets,
    // Mission
    '{{mission.missionHeading}}':    val(m?.missionHeading, 'What We Do Every Day'),
    '{{mission.missionIntro}}':      val(m?.missionIntro, ''),
    '{{mission.missionItems}}':      missionItems,
    '{{mission.visionHeading}}':     val(m?.visionHeading, "Where We're Headed"),
    '{{mission.visionBody}}':        val(m?.visionBody, ''),
    '{{mission.guidingPrinciples}}': guidingPrinciples,
    // Testimonials
    '{{testimonials.cards}}': testimonialCards,
    // Environment
    '{{env.sectionLabel}}':  val(e?.sectionLabel, 'Sustainability Matters'),
    '{{env.heading}}':       val(e?.heading, 'Our Environmental Commitment'),
    '{{env.intro}}':         val(e?.introParagraph, ''),
    '{{env.cards}}':         envCards,
    '{{env.stats}}':         envStats,
    '{{env.policyLinks}}':   policyLinks,
    // Commitment
    '{{commitment.heading}}':    val(co?.heading, 'Our Commitment to You'),
    '{{commitment.body1}}':      val(co?.body1, ''),
    '{{commitment.body2}}':      val(co?.body2, ''),
    '{{commitment.valuePills}}': valuePills,
    // Contact
    '{{contact.sectionLabel}}':  val(ct?.sectionLabel, 'Get in Touch'),
    '{{contact.heading}}':       val(ct?.heading, 'Start Your Order Today'),
    '{{contact.sub}}':           val(ct?.subParagraph, ''),
    '{{contact.persons}}':       val(ct?.contactPersons, 'Chris & Margy Abbot'),
    '{{contact.addressStreet}}': val(ct?.addressStreet, '13 Burma Road, Pooraka SA 5095'),
    '{{contact.addressCity}}':   val(ct?.addressCity, 'Pooraka, South Australia'),
    '{{contact.addressGPO}}':    val(ct?.addressGPO, 'GPO Box 310, Adelaide SA 5000'),
    '{{contact.phone}}':         val(ct?.phone, '(08) 8349 5222'),
    '{{contact.fax}}':           val(ct?.fax, '(08) 8349 4390'),
    '{{contact.email}}':         ct?.email || 'admin@amjproduce.com.au',
    '{{contact.formNote}}':      val(ct?.formNote, 'We typically respond within one business day.'),
    // Footer
    '{{footer.companyName}}':         val(fo?.companyName, 'AMJ Produce Co.'),
    '{{footer.companySubtitle}}':     val(fo?.companySubtitle, 'Fruit & Vegetable Wholesalers'),
    '{{footer.addressStreet}}':       val(fo?.addressStreet, '13 Burma Road, Pooraka SA 5095'),
    '{{footer.phone}}':               val(fo?.phone, '(08) 8349 5222'),
    '{{footer.fax}}':                 val(fo?.fax, '(08) 8349 4390'),
    '{{footer.email}}':               fo?.email || 'admin@amjproduce.com.au',
    '{{footer.commitmentParagraph}}': val(fo?.commitmentParagraph, ''),
    '{{footer.certItems}}':           certItems,
    '{{footer.designerLabel}}':       val(fo?.designerLabel, 'Website by Shift Web Designs'),
    '{{footer.designerUrl}}':         fo?.designerUrl || '#',
  }

  // ── Read template, substitute, return ────────────────────────────
  const templatePath = path.join(process.cwd(), 'public/template.html')
  let html = readFileSync(templatePath, 'utf-8')

  for (const [token, value] of Object.entries(tokens)) {
    html = html.replaceAll(token, value ?? '')
  }

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
