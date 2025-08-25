## Component Interface
- **ProfessionalJourney**
  - **title**: `string` - Displays the title of the journey (default: 'AI-Powered Fraud & Risk Intelligence').
  - **subtitle**: `string` - Displays a subtitle (default: a predefined string).
  - **items**: `TimelineItem[]` - An array of timeline items for the professional journey (default: predefined items).
  - **data-id**: `string` - Custom data attribute for the component.

- **TimelineItem**
  - **icon**: `React.ReactNode` - Icon representation of the job.
  - **company**: `string` - Company name.
  - **role**: `string` - Job title.
  - **period**: `string` - Employment duration.
  - **description**: `string` - Description of job responsibilities.
  - **isCurrent**: `boolean` - Indicates if the job is current.

## Exported Components
- **ComponentPreview**
- **ProfessionalJourney**
- **Icon1**
- **Icon2**
- **Icon3**

## Usage Examples
```javascript
import { ProfessionalJourney } from './src/ProfessionalJourney';
import { Icon1, Icon2 } from './src/Icon1';

const customItems = [
  {
    icon: <Icon1 className="w-6 h-6" />,
    company: 'Tech Startup',
    role: 'Senior Engineer',
    period: '2024 - Present',
    description: 'Leading development of next-generation AI platform',
    isCurrent: true,
  },
  {
    icon: <Icon2 className="w-6 h-6" />,
    company: 'Previous Company',
    role: 'Lead Developer',
    period: '2022 - 2024',
    description: 'Built scalable microservices architecture',
  },
];

<ProfessionalJourney
  title="Career Highlights"
  subtitle="Key milestones in my professional development"
  items={customItems}
/>
```

## Design Guidelines
- Use a consistent spacing scale (e.g., `px-4`, `py-6`) for spacing elements.
- The component works well with a dark color palette, typically utilizing shades of gray and contrasting accent colors (e.g., indigo).
- Utilize **Roboto** or similar sans-serif fonts for readability.
- Maintain a clear visual hierarchy by emphasizing significant headings with higher font sizes.
- Ensure responsive design by employing relative width classes (e.g., `w-full`) and medium spacing to adjust on various screen sizes.
- Focus on accessibility by ensuring that icons have clear descriptions and using ARIA attributes where necessary.

## Styling & Behavior
- Key styling props include `className` for custom styles and the ability to pass SVG props to icons.
- The component reacts responsively to screen sizes using Tailwind CSS utility classes.
- Implement hover and active states for user interaction, ensuring visibility on different backgrounds.
- Ensure no content is hidden on smaller screens unless explicitly required.
- Consider dark/light mode adaptability with appropriate CSS.

## Integration Notes
- No special CSS variables are required; standard Tailwind CSS utility classes are used.
- Ensure Tailwind CSS imports remain in place to maintain styles:
```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
```
- Integrate with Redux or Context Providers if needing global data or state management.

## Best Practices
- Utilize concise titles and informative descriptions within the `ProfessionalJourney`.
- Avoid excessive icon sizes; maintain a balance for visual consistency.
- Use memoization for `items` if they are generated from complex computations.
- Validate props to ensure expected data types are passed.
- Regularly test for accessibility compliance using tools like aXe or Lighthouse.