/**
 * build-site.ts
 * Reads index.template.html, substitutes all {{tokens}} with live CMS data,
 * and writes the result to ../index.html.
 *
 * Run: npm run build:site
 */

import payload from 'payload'
import config  from '../../payload.config'
import fs      from 'fs/promises'
import path    from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)
const ROOT       = path.resolve(__dirname, '../../')

function esc(str: string | null | undefined): string {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function main() {
  await payload.init({ config, local: true })

  const [hero, nav, about, fresho, delivery, mission, env, commitment, contact, footer, testimonialRes] =
    await Promise.all([
      payload.find({ collection: 'hero',        limit: 1 }),
      payload.find({ collection: 'navigation',  limit: 1 }),
      payload.find({ collection: 'about',       limit: 1 }),
      payload.find({ collection: 'fresho',      limit: 1 }),
      payload.find({ collection: 'delivery',    limit: 1 }),
      payload.find({ collection: 'mission',     limit: 1 }),
      payload.find({ collection: 'environment', limit: 1 }),
      payload.find({ collection: 'commitment',  limit: 1 }),
      payload.find({ collection: 'contact',     limit: 1 }),
      payload.find({ collection: 'footer',      limit: 1 }),
      payload.find({ collection: 'testimonials', sort: 'order', limit: 100 }),
    ])

  const h  = hero.docs[0]         as any
  const n  = nav.docs[0]          as any
  const a  = about.docs[0]        as any
  const fr = fresho.docs[0]       as any
  const d  = delivery.docs[0]     as any
  const m  = mission.docs[0]      as any
  const e  = env.docs[0]          as any
  const co = commitment.docs[0]   as any
  const ct = contact.docs[0]      as any
  const fo = footer.docs[0]       as any
  const testimonials = testimonialRes.docs as any[]

  // ── Build array-based HTML blocks ─────────────────────────────

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

  // ── Token map ────────────────────────────────────────────────
  const tokens: Record<string, string> = {
    // Navigation
    '{{nav.wholesale}}':    esc(n?.wholesaleLabel),
    '{{nav.about}}':        esc(n?.aboutLabel),
    '{{nav.products}}':     esc(n?.productsLabel),
    '{{nav.media}}':        esc(n?.mediaLabel),
    '{{nav.environment}}':  esc(n?.environmentLabel),
    '{{nav.contact}}':      esc(n?.contactLabel),
    '{{nav.marketReport}}': esc(n?.marketReportLabel),
    // Hero
    '{{hero.eyebrow}}':    esc(h?.eyebrow),
    '{{hero.titleLine1}}': esc(h?.titleLine1),
    '{{hero.titleLine2}}': esc(h?.titleLine2),
    '{{hero.sub}}':        esc(h?.subParagraph),
    '{{hero.cta1}}':       esc(h?.ctaPrimaryLabel),
    '{{hero.cta2}}':       esc(h?.ctaOutlineLabel),
    // About
    '{{about.sectionLabel}}':  esc(a?.sectionLabel),
    '{{about.heading}}':       esc(a?.heading),
    '{{about.lead}}':          esc(a?.leadParagraph),
    '{{about.body1}}':         esc(a?.body1),
    '{{about.body2}}':         esc(a?.body2),
    '{{about.body3}}':         esc(a?.body3),
    '{{about.awards}}':        awards,
    '{{about.pillars}}':       pillars,
    // Fresho
    '{{fresho.sectionLabel}}': esc(fr?.sectionLabel),
    '{{fresho.heading}}':      esc(fr?.heading),
    '{{fresho.body}}':         esc(fr?.body),
    '{{fresho.buttonLabel}}':  esc(fr?.buttonLabel),
    '{{fresho.buttonUrl}}':    esc(fr?.buttonUrl),
    // Delivery
    '{{delivery.sectionLabel}}':  esc(d?.sectionLabel),
    '{{delivery.heading}}':       esc(d?.heading),
    '{{delivery.lead}}':          esc(d?.leadParagraph),
    '{{delivery.bullets}}':       deliveryBullets,
    // Mission
    '{{mission.missionHeading}}':    esc(m?.missionHeading),
    '{{mission.missionIntro}}':      esc(m?.missionIntro),
    '{{mission.missionItems}}':      missionItems,
    '{{mission.visionHeading}}':     esc(m?.visionHeading),
    '{{mission.visionBody}}':        esc(m?.visionBody),
    '{{mission.guidingPrinciples}}': guidingPrinciples,
    // Testimonials
    '{{testimonials.cards}}': testimonialCards,
    // Environment
    '{{env.sectionLabel}}':   esc(e?.sectionLabel),
    '{{env.heading}}':        esc(e?.heading),
    '{{env.intro}}':          esc(e?.introParagraph),
    '{{env.cards}}':          envCards,
    '{{env.stats}}':          envStats,
    '{{env.policyLinks}}':    policyLinks,
    // Commitment
    '{{commitment.heading}}':    esc(co?.heading),
    '{{commitment.body1}}':      esc(co?.body1),
    '{{commitment.body2}}':      esc(co?.body2),
    '{{commitment.valuePills}}': valuePills,
    // Contact
    '{{contact.sectionLabel}}':   esc(ct?.sectionLabel),
    '{{contact.heading}}':        esc(ct?.heading),
    '{{contact.sub}}':            esc(ct?.subParagraph),
    '{{contact.persons}}':        esc(ct?.contactPersons),
    '{{contact.addressStreet}}':  esc(ct?.addressStreet),
    '{{contact.addressCity}}':    esc(ct?.addressCity),
    '{{contact.addressGPO}}':     esc(ct?.addressGPO),
    '{{contact.phone}}':          esc(ct?.phone),
    '{{contact.fax}}':            esc(ct?.fax),
    '{{contact.email}}':          ct?.email || '',
    '{{contact.formNote}}':       esc(ct?.formNote),
    // Footer
    '{{footer.companyName}}':         esc(fo?.companyName),
    '{{footer.companySubtitle}}':     esc(fo?.companySubtitle),
    '{{footer.addressStreet}}':       esc(fo?.addressStreet),
    '{{footer.phone}}':               esc(fo?.phone),
    '{{footer.fax}}':                 esc(fo?.fax),
    '{{footer.email}}':               fo?.email || '',
    '{{footer.commitmentParagraph}}': esc(fo?.commitmentParagraph),
    '{{footer.certItems}}':           certItems,
    '{{footer.designerLabel}}':       esc(fo?.designerLabel),
    '{{footer.designerUrl}}':         fo?.designerUrl || '',
  }

  // ── Read template, substitute, write output ───────────────────
  const templatePath = path.join(ROOT, 'index.template.html')
  const outputPath   = path.join(ROOT, 'index.html')

  let html: string
  try {
    html = await fs.readFile(templatePath, 'utf-8')
  } catch {
    console.error('index.template.html not found. Create it by copying index.html and replacing text with {{tokens}}.')
    process.exit(1)
  }

  for (const [token, value] of Object.entries(tokens)) {
    html = html.replaceAll(token, value ?? '')
  }

  await fs.writeFile(outputPath, html, 'utf-8')
  console.log(`✅ index.html rebuilt from CMS data — ${new Date().toLocaleTimeString()}`)

  process.exit(0)
}

main().catch(err => {
  console.error('Build failed:', err)
  process.exit(1)
})
