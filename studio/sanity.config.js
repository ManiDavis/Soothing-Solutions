import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { presentationTool } from 'sanity/presentation'
import { schemaTypes } from './schemaTypes'
import { CogIcon, TagIcon, UserIcon, StarIcon, HomeIcon, EnvelopeIcon } from '@sanity/icons'

const SINGLETONS = ['siteSettings', 'whyUs', 'gymShowcase']
// Actual document IDs in the dataset (UUID-based)
const SINGLETON_IDS = [
  '873a727a-7c5e-45d5-a3b6-0c30ae62cc80',
  '312cfba4-666f-40a9-85dd-50ba6b68ea26',
  '4835df1c-c6ac-4c6e-aaea-a532bc3adba7',
]

const PREVIEW_URL = 'https://trainstation-guernsey-web.vercel.app'

const structure = (S) =>
  S.list()
    .title('TrainStation Guernsey')
    .items([
      S.listItem()
        .title('Trial Bookings & Enquiries')
        .icon(EnvelopeIcon)
        .child(
          S.documentTypeList('enquiry')
            .title('Trial Bookings & Enquiries')
            .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
        ),
      S.divider(),
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('873a727a-7c5e-45d5-a3b6-0c30ae62cc80')
            .title('Site Settings')
        ),
      S.listItem()
        .title('Why Train With Us')
        .icon(StarIcon)
        .child(
          S.document()
            .schemaType('whyUs')
            .documentId('312cfba4-666f-40a9-85dd-50ba6b68ea26')
            .title('Why Train With Us Section')
        ),
      S.listItem()
        .title('Gym Showcase')
        .icon(HomeIcon)
        .child(
          S.document()
            .schemaType('gymShowcase')
            .documentId('4835df1c-c6ac-4c6e-aaea-a532bc3adba7')
            .title('Gym Showcase Section')
        ),
      S.divider(),
      S.listItem()
        .title('Pricing Plans')
        .icon(TagIcon)
        .child(S.documentTypeList('pricingPlan').title('Pricing Plans')),
      S.listItem()
        .title('Reviews')
        .icon(UserIcon)
        .child(S.documentTypeList('review').title('Reviews')),
    ])

export default defineConfig({
  name: 'trainstation',
  title: 'TrainStation Guernsey',
  projectId: 'weak5669',
  dataset: 'production',
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: PREVIEW_URL,
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETONS.includes(schemaType)),
  },
  document: {
    actions: (input, context) =>
      SINGLETONS.includes(context.schemaType)
        ? input.filter(({ action }) => action !== 'duplicate')
        : input,
  },
})
