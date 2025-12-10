import { z } from 'zod';

// Define the Zod schema matching the QuestionnaireState interface
export const questionnaireSchema = z.object({
  // 1. Estimated Total Revenue
  revenue: z.enum(['less_than_20l', '20l_to_50l', '50l_to_75l', 'above_75l'], {
    required_error: "Please select your estimated total revenue.",
  }),

  // 2. Client Location
  client_location: z.array(z.enum(['india', 'usa', 'uk_europe', 'uae_middle_east', 'other']))
    .min(1, "Please select at least one client location."),

  // 3. Payment Methods
  payment_methods: z.array(z.enum(['paypal_stripe', 'wise_payoneer', 'swift', 'crypto']))
    .min(1, "Please select at least one payment method."),

  // 4. GST Number
  gst_number: z.enum(['yes', 'no'], {
    required_error: "Do you have a GST Number?",
  }),

  // 5. LUT Filed (Conditional)
  lut_filed: z.enum(['yes', 'no_dont_know']).optional(),

  // 6. Tax Forms
  tax_forms: z.enum(['signed', 'ignored', 'no'], {
    required_error: "Please select an option regarding tax forms.",
  }),

  // 7. Main Profession
  profession: z.string().min(1, "Please enter your main profession."),

  // 8. Capital Expenditure
  capital_expenditure: z.enum(['above_50k', 'below_50k', 'no'], {
    required_error: "Please select your capital expenditure status.",
  }),

  // 9. Expense Records Quality (1-5)
  expense_records: z.number().min(1).max(5, "Please rate your expense records quality."),

  // 10. Investments
  investments: z.enum(['regular', 'small', 'no'], {
    required_error: "Please select your investment status.",
  }),

  // 11. Entity Type
  entity_type: z.enum(['proprietorship', 'partnership', 'pvt_ltd', 'llp'], {
    required_error: "Please select your entity type.",
  }),

  // 12. Hire Freelancers
  hire_freelancers: z.enum(['yes', 'no'], {
    required_error: "Do you hire freelancers?",
  }),

  // 13. Pay > 30k
  pay_above_30k: z.enum(['yes', 'no'], {
    required_error: "Do you pay anyone > ₹30k/year?",
  }),

  // 14. Documents (We'll just track if they were uploaded or their names for now, as file content handling is complex)
  // Making it optional/any for flexibility in UI
  documents: z.any().optional(),

  // 15. Other Info
  other_info: z.string().optional(),

}).refine((data) => {
  if (data.gst_number === 'yes') {
    return !!data.lut_filed;
  }
  return true;
}, {
  message: "Please indicate if you have filed an LUT.",
  path: ["lut_filed"],
});

// Define the TypeScript type from the schema
export type QuestionnaireState = z.infer<typeof questionnaireSchema>;

/**
 * Helper function to validate questionnaire data
 * @param data Unknown input data
 * @returns Validation result object
 */
export function validateQuestionnaire(data: unknown): {
  success: boolean;
  data?: QuestionnaireState;
  errors?: string[];
} {
  const result = questionnaireSchema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  } else {
    // Extract user-friendly error messages
    const errors = result.error.errors.map((err) => err.message);
    return {
      success: false,
      errors: errors,
    };
  }
}
