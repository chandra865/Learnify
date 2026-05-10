import {z} from "zod";

const loginSchema = z.object({
    email: z.email("Invalid email format"),
  password: z.string(),
  // .min(8, "Password must be at least 8 characters long")
    // .max(12, "Password must be at most 12 characters long")
    // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,"Password must contain at least one lowercase letter, one uppercase letter, one number and one special character"),
})


const registerSchema = z.object({
     email: z.email("Invalid email format"),
  password: z.string(),
  // .min(8, "Password must be at least 8 characters long")
    // .max(12, "Password must be at most 12 characters long")
    // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
    //   "Password must contain at least one lowercase letter, one uppercase letter, one number and one special character"),
});

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  bio: z.string().max(500, "Bio is too long").optional(),
  profilePicture: z.string().optional(),
  socialLinks: z.string().optional(),
});

const educationSchema = z.object({
  institution: z.string().min(1, "School is required"),
  degree: z.string().min(1, "Degree is required"),
  startYear: z.number(),
  endYear: z.number(),
  cgpa: z.string(),
});

const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  jobTitle: z.string().min(1, "Title is required"),
  location: z.string().optional(),
  startYear: z.number(),
  endYear: z.number(),
  description: z.string().optional(),
});

const expertiseSchema = z.object({
  expertise: z.string().min(1, "Expertise is required"),
});

export  {
  loginSchema,
  registerSchema,
  updateProfileSchema,
  educationSchema,
  experienceSchema,
  expertiseSchema
}
