# AI Website Builder Development Prompt

## Project Overview
Build a comprehensive website builder tool targeting both technical and non-technical users. The system should use JSON for data management initially (frontend-only), with plans for backend integration later. The core value proposition is delivering complete, production-ready React projects with perfect folder structure that work immediately after `npm install && npm run dev`.

## Core Functionality Requirements

### 1. Dynamic Content Customization
- Enable full customization of all content elements (images, videos, text, titles, paragraphs, buttons, icons any other editable content)
- Provide dual customization approach:
  - Manual Tailwind CSS input for advanced users ✅
  - Visual option selection for non-technical users ✅
- Ensure all customizations are properly applied and exportable

### 2. Dynamic Page Management
- Allow unlimited page creation and deletion ✅
- Default pages: Home, About, Service, Contact ✅
- Each page should be fully customizable and manageable ✅
- Implement proper routing structure for all pages ❓❓
 
### 3. Component Library System 
- Create extensive library of pre-built components with multiple variants: ✅
  - Navigation bars (multiple designs) ✅
  - Hero sections (various layouts) ✅
  - Service sections (different styles) ✅
  - Feature sections (different styles) ✅
  - Contact sections (different styles) ✅
  - Footer components (multiple options) ✅
  - Additional UI components as needed ❓❓
- Each component category should offer diverse design options ✅
- Components must be easily selectable and swappable ✅

### 4. Section Reordering 
- Implement intuitive drag-and-drop interface for section reordering ✅
- Maintain component integrity during reordering ✅
- Provide visual feedback during drag operations ✅

### 5. Theme Customization 
- Complete theme control via Tailwind CSS ✅
- Color picker integration for easy theme updates ✅
- Theme changes should apply globally while respecting component-specific customizations ❓❓

### 6. Template System
- Provide pre-designed templates as starting points ✅
- Allow complete template customization after selection ❓❓
- Template selection should not lock users into rigid structures ✅

### 7. Content Management
- All content changes should be stored within respective components
- Maintain content persistence across sessions
- Enable inline editing for text content

### 8. Code Export System
- Generate complete, organized React project structure ✅
- Include all necessary dependencies and configurations ✅
- Ensure exported project includes: ✅
  - Proper React Router DOM setup ✅
  - All selected and customized components ✅
  - Complete page structure ✅
  - Tailwind CSS configuration ✅
  - Package.json with all dependencies ✅
- Export as downloadable ZIP file ✅
- **Critical**: Exported project must work perfectly with just `npm install && npm run dev`

## User Management & Analytics

### 9. User Activity Tracking
- Track project creation, exports, and content modifications
- Monitor most-used components for insights
- Store user preferences and project history

### 10. Credit System
- Initialize users with 3 free credits
- Deduct 1 credit per project export/download
- Implement credit purchase system ($3 per credit)
- Provide clear credit balance visibility

## Enhanced User Experience Features

### 11. Live Preview Mode
- Real-time preview updates without page refresh ✅
- Instant visual feedback for all changes ✅
- Seamless editing experience ✅

### 12. Responsive Design Testing
- Built-in device view switcher (mobile, tablet, desktop)
- Real-time responsiveness testing
- Ensure all components work across all screen sizes

### 13. Undo/Redo Functionality
- Comprehensive action history tracking
- Support for content changes, component swaps, and structural modifications
- Intuitive keyboard shortcuts (Ctrl+Z, Ctrl+Y)

### 14. Save System
- Automatic background saving
- Manual save option for user control ✅
- Visual save status indicators

### 15. Drag and Drop Interface
- Intuitive component placement and reordering ✅
- Visual drop zones and feedback
- Smooth animations and transitions

### 16. Component Discovery
- Search functionality for component library
- Category-based filtering
- Clear component previews and descriptions

### 17. Editor Interface Modes
- Dark/Light mode toggle for editor UI
- User preference persistence
- Comfortable editing environment

### 18. SEO Management
- Meta title and description editing per page
- Custom favicon upload and management
- Basic SEO optimization tools

### 19. Advanced Page Settings
- Custom script integration (Google Analytics, etc.)
- Individual page meta tag management
- URL slug customization
- Page-specific configurations

## Technical Implementation Standards

### Responsive Design
- Ensure pixel-perfect responsiveness across all devices
- Test thoroughly on desktop, tablet, and mobile viewports
- Use appropriate Tailwind CSS responsive utilities

### Form Handling & Validation
- Implement real-time inline validations
- Provide clear error messaging and user guidance
- Use proper input types and accessibility features
- Include auto-complete and focus management
- Optimize for performance and usability

### Edge Case Management
Handle all potential edge cases gracefully:
- Empty states with helpful messaging
- Broken or missing images with fallbacks
- Unauthorized access scenarios
- Loading states for all operations
- Error states for failed operations
- Form submission failures with recovery options

### Code Quality Standards
- Write clean, readable code without inline comments
- Use descriptive variable and function names
- Build reusable, decoupled UI components
- Implement proper prop typing (TypeScript preferred)
- Maintain clear separation of concerns
- Ensure component reusability across the application

### Documentation Requirements
- Maintain comprehensive README.md with:
  - Clear setup instructions
  - Technology stack overview
  - Available scripts and commands
  - Deployment guidelines
- Write JSDoc/TSDoc for public utilities and services
- Document complex logic and business rules

## Target Audience Considerations
- **Technical Users**: Provide advanced customization options, code access, and detailed controls
- **Non-Technical Users**: Offer intuitive visual interfaces, guided workflows, and simplified options
- **Universal Features**: Ensure all functionality is accessible regardless of technical expertise

## Success Criteria
The project succeeds when:
1. Exported projects work immediately after `npm install && npm run dev`
2. Both technical and non-technical users can create professional websites
3. All customizations are properly preserved and functional
4. The interface is intuitive and responsive across all devices
5. The component library provides sufficient variety for diverse needs
6. The credit system operates smoothly and transparently

## Development Approach
Start with frontend-only implementation using JSON for data persistence. Focus on creating a robust, feature-complete interface that demonstrates all functionality before backend integration. Prioritize code quality and user experience to ensure the tool meets professional standards from day one.

## Themes to be used:
- bg-[#1c1c1c] for background
- bg-[#272725] for accents
- text-white for texts 



<!-- Remaining Task to complet  -->

- Image & Video Upload with Live Preview:
Implement image and video upload functionality with live previews. For now, store the files locally and make sure the file path is saved properly. where ever the user clicks on the image or video it should at thier open a modal for uploading the image or video using url or browse from the local and show the real time preview of the image or video. and render it in the editor. where that element was selected


- Dynamic Array/Object Input Handling: ✅ [need to test it again for each component array ]
When an element is selected in a component and its type is an array or object, we want to dynamically render inputs based on the array.length, prefilled with the existing data. Users should be able to add, update, or delete any item in that array/object directly through the UI. 


- Theme Integration Fix:
Fix the issue where theme updates are not correctly applying to all elements. Ensure that every component properly reflects the selected theme.

- when editing any one element particularly like changing it content or style, the all the elements are refeclitng the changes. so fix that issue

- in advnaced mode, the tailwindCss or customCss is not been applied correct to that element

- add a delete modal before deleting any thing in the project like page deletion , compoent deletion etc.

- agr data strucuture array h or uske koi bhi 1 element ko select kru to bhi pura dynamicArryCrud wala moda1 open ho no chahiye naa ki single element ka modal open ho

- saari fucntuonality ko test kro hr 1 element ko update kr skey uska content uski styles everything

- img tag ko select krra hu lekin text edit ka modal open ho rha hai fix the bug