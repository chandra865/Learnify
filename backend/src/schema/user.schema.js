import {z} from "zod";

const loginSchema = z.object({
    email: z.email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long")
    .max(12, "Password must be at most 12 characters long").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,"Password must contain at least one lowercase letter, one uppercase letter, one number and one special character"),
})


const registerSchema = z.object({
     email: z.email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long")
    .max(12, "Password must be at most 12 characters long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
      "Password must contain at least one lowercase letter, one uppercase letter, one number and one special character"),
});

const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  bio: z.string().max(500, "Bio is too long").optional(),
  profilePicture: z.string().optional(),
});

const educationSchema = z.object({
  school: z.string().min(1, "School is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  from: z.string().min(1, "Start date is required"),
  to: z.string().optional(),
  description: z.string().optional(),
});

const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  title: z.string().min(1, "Title is required"),
  location: z.string().optional(),
  from: z.string().min(1, "Start date is required"),
  to: z.string().optional(),
  description: z.string().optional(),
});

const expertiseSchema = z.object({
  expertise: z.array(z.string()).min(1, "At least one expertise is required"),
});

export  {
  loginSchema,
  registerSchema,
  updateProfileSchema,
  educationSchema,
  experienceSchema,
  expertiseSchema
}
