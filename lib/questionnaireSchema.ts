import { z } from 'zod';

// Define the Zod schema matching the QuestionnaireState interface
export const questionnaireSchema = z.object({
  entity_type: z.enum(['sole_prop', 'pvt_ltd'], {
    required_error: "Please select your entity type.",
  }),
  profession_nature: z.enum(['specified', 'business'], {
    required_error: "Please select the nature of your profession.",
  }),
  annual_turnover: z.enum(['under_20l', '20l_to_75l', 'above_75l'], {
    required_error: "Please select your expected annual turnover.",
  }),
  client_countries: z.array(z.enum(['usa', 'uk', 'uae', 'europe', 'india']))
    .min(1, "Please select at least one client location."),
  payment_modes: z.array(z.enum(['bank_wire', 'paypal', 'wise', 'payoneer', 'crypto']))
    .min(1, "Please select at least one payment mode."),
  gst_status: z.enum(['yes', 'no'], {
    required_error: "Please indicate your GST registration status.",
  }),
  lut_status: z.enum(['yes', 'no', 'not_sure']).optional(),
}).refine((data) => {
  if (data.gst_status === 'yes') {
    return !!data.lut_status;
  }
  return true;
}, {
  message: "Please indicate your LUT filing status.",
  path: ["lut_status"],
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
