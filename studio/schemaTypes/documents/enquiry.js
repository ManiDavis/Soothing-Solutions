import { defineType, defineField } from 'sanity'
import { EnvelopeIcon } from '@sanity/icons'

export const enquiry = defineType({
  name: 'enquiry',
  title: 'Trial Bookings & Enquiries',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'email', title: 'Email', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({
      name: 'interest',
      title: 'Interested In',
      type: 'string',
      options: {
        list: [
          { title: 'Free Trial', value: 'free-trial' },
          { title: 'Standard Membership', value: 'standard' },
          { title: 'Student / Senior Membership', value: 'student-senior' },
          { title: 'Couples Membership', value: 'couples' },
          { title: 'Day Pass', value: 'day-pass' },
          { title: 'Personal Training', value: 'personal-training' },
          { title: 'General Enquiry', value: 'general' },
        ],
      },
    }),
    defineField({ name: 'message', title: 'Message', type: 'text', rows: 4 }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'new',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Contacted', value: 'contacted' },
          { title: 'Booked', value: 'booked' },
          { title: 'Closed', value: 'closed' },
        ],
        layout: 'radio',
      },
    }),
    defineField({ name: 'submittedAt', title: 'Submitted At', type: 'datetime' }),
  ],
  orderings: [
    { title: 'Newest First', name: 'submittedAtDesc', by: [{ field: 'submittedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'name', subtitle: 'email', status: 'status' },
    prepare: ({ title, subtitle, status }) => ({
      title,
      subtitle: `${subtitle}${status ? ` · ${status}` : ''}`,
    }),
  },
})
