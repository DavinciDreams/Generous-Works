'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function FormsShowcasePage() {
  const [sliderValue, setSliderValue] = useState([50]);
  const [switchValue, setSwitchValue] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [textValue, setTextValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [radioValue, setRadioValue] = useState('option1');

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Forms Components Showcase</h1>
        <p className="text-muted-foreground">
          Standard UI form components for user input and interaction
        </p>
      </div>

      <div className="space-y-12">
        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Buttons</h2>
          <p className="text-sm text-muted-foreground">
            Clickable buttons with different variants and sizes
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">🎨</Button>
          </div>
        </section>

        {/* Input Fields */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Input Fields</h2>
          <p className="text-sm text-muted-foreground">
            Single-line text input for collecting user data
          </p>
          <div className="space-y-3 max-w-md">
            <div>
              <Label htmlFor="text-input">Text Input</Label>
              <Input
                id="text-input"
                type="text"
                placeholder="Enter text..."
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email-input">Email Input</Label>
              <Input id="email-input" type="email" placeholder="Enter email..." />
            </div>
            <div>
              <Label htmlFor="password-input">Password Input</Label>
              <Input
                id="password-input"
                type="password"
                placeholder="Enter password..."
              />
            </div>
            <div>
              <Label htmlFor="number-input">Number Input</Label>
              <Input id="number-input" type="number" placeholder="Enter number..." />
            </div>
            <div>
              <Label htmlFor="disabled-input">Disabled Input</Label>
              <Input id="disabled-input" disabled placeholder="Disabled input" />
            </div>
          </div>
        </section>

        {/* Textarea */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Textarea</h2>
          <p className="text-sm text-muted-foreground">
            Multi-line text input for longer content
          </p>
          <div className="max-w-md">
            <Label htmlFor="textarea">Message</Label>
            <Textarea
              id="textarea"
              placeholder="Enter your message..."
              rows={5}
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
            />
          </div>
        </section>

        {/* Checkbox */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Checkbox</h2>
          <p className="text-sm text-muted-foreground">
            Binary choice selection with label
          </p>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="checkbox-1"
                checked={checkboxValue}
                onCheckedChange={(checked) => setCheckboxValue(checked as boolean)}
              />
              <Label htmlFor="checkbox-1" className="cursor-pointer">
                Accept terms and conditions
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="checkbox-2" />
              <Label htmlFor="checkbox-2" className="cursor-pointer">
                Subscribe to newsletter
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="checkbox-3" disabled />
              <Label htmlFor="checkbox-3" className="text-muted-foreground">
                Disabled option
              </Label>
            </div>
          </div>
        </section>

        {/* Switch */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Switch</h2>
          <p className="text-sm text-muted-foreground">
            Toggle between on/off states
          </p>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Switch
                id="switch-1"
                checked={switchValue}
                onCheckedChange={setSwitchValue}
              />
              <Label htmlFor="switch-1" className="cursor-pointer">
                Enable notifications ({switchValue ? 'On' : 'Off'})
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="switch-2" />
              <Label htmlFor="switch-2" className="cursor-pointer">
                Dark mode
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="switch-3" disabled />
              <Label htmlFor="switch-3" className="text-muted-foreground">
                Disabled switch
              </Label>
            </div>
          </div>
        </section>

        {/* Slider */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Slider</h2>
          <p className="text-sm text-muted-foreground">
            Numeric value selection via draggable handle
          </p>
          <div className="space-y-4 max-w-md">
            <div>
              <Label>Volume: {sliderValue[0]}%</Label>
              <Slider
                value={sliderValue}
                onValueChange={setSliderValue}
                max={100}
                step={1}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Temperature (0-100)</Label>
              <Slider defaultValue={[25]} max={100} step={5} className="mt-2" />
            </div>
            <div>
              <Label>Disabled Slider</Label>
              <Slider defaultValue={[50]} disabled className="mt-2" />
            </div>
          </div>
        </section>

        {/* Select Dropdown */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Select Dropdown</h2>
          <p className="text-sm text-muted-foreground">
            Single selection from a list of options
          </p>
          <div className="max-w-md space-y-3">
            <div>
              <Label htmlFor="select-1">Country</Label>
              <Select value={selectValue} onValueChange={setSelectValue}>
                <SelectTrigger id="select-1">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="de">Germany</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="select-2">Framework</Label>
              <Select>
                <SelectTrigger id="select-2">
                  <SelectValue placeholder="Select a framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="vue">Vue</SelectItem>
                  <SelectItem value="svelte">Svelte</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Radio Group */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Radio Group</h2>
          <p className="text-sm text-muted-foreground">
            Single selection from mutually exclusive options
          </p>
          <RadioGroup value={radioValue} onValueChange={setRadioValue}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option1" id="radio1" />
              <Label htmlFor="radio1" className="cursor-pointer">
                Option 1
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option2" id="radio2" />
              <Label htmlFor="radio2" className="cursor-pointer">
                Option 2
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option3" id="radio3" />
              <Label htmlFor="radio3" className="cursor-pointer">
                Option 3
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option4" id="radio4" disabled />
              <Label htmlFor="radio4" className="text-muted-foreground">
                Disabled option
              </Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-muted-foreground">
            Selected: {radioValue}
          </p>
        </section>

        {/* Complete Form Example */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Complete Form Example</h2>
          <p className="text-sm text-muted-foreground">
            All form components working together
          </p>
          <form
            className="space-y-4 max-w-md border rounded-lg p-6"
            onSubmit={(e) => {
              e.preventDefault();
              alert('Form submitted!');
            }}
          >
            <div>
              <Label htmlFor="form-name">Name</Label>
              <Input id="form-name" placeholder="John Doe" required />
            </div>

            <div>
              <Label htmlFor="form-email">Email</Label>
              <Input id="form-email" type="email" placeholder="john@example.com" required />
            </div>

            <div>
              <Label htmlFor="form-message">Message</Label>
              <Textarea id="form-message" placeholder="Your message..." rows={4} />
            </div>

            <div>
              <Label htmlFor="form-priority">Priority</Label>
              <Select>
                <SelectTrigger id="form-priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="form-terms" required />
              <Label htmlFor="form-terms" className="cursor-pointer">
                I agree to the terms and conditions
              </Label>
            </div>

            <div className="flex gap-2">
              <Button type="submit">Submit</Button>
              <Button type="reset" variant="outline">
                Reset
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
