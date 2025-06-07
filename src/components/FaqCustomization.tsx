import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FaqCustomizationProps {
  customization: {
    margin: string;
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    borderRadius: string;
  };
  onCustomizationChange: (customization: any) => void;
}

const FaqCustomization: React.FC<FaqCustomizationProps> = ({
  customization,
  onCustomizationChange,
}) => {
  const handleChange = (field: string, value: string) => {
    onCustomizationChange({
      ...customization,
      [field]: value,
    });
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-lg print:hidden shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Personnaliser l'apparence</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className='flex flex-col gap-1'>
          <Label htmlFor="margin">Marge (px)</Label>
          <Input
            id="margin"
            type="number"
            value={customization.margin.replace('px', '')}
            onChange={(e) => handleChange('margin', `${e.target.value}px`)}
            placeholder="8"
            min="0"
            max="50"
          />
        </div>

        <div className='flex flex-col gap-1'>
          <Label htmlFor="backgroundColor">Couleur du fond</Label>
          <div className="flex gap-2">
            <Input
              id="backgroundColor"
              type="color"
              value={customization.backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="w-12 h-10 p-1 rounded cursor-pointer"
            />
            <Input
              type="text"
              value={customization.backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              placeholder="#ffffff"
              className="flex-1"
            />
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <Label htmlFor="textColor">Couleur du texte</Label>
          <div className="flex gap-2">
            <Input
              id="textColor"
              type="color"
              value={customization.textColor}
              onChange={(e) => handleChange('textColor', e.target.value)}
              className="w-12 h-10 p-1 rounded cursor-pointer"
            />
            <Input
              type="text"
              value={customization.textColor}
              onChange={(e) => handleChange('textColor', e.target.value)}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <Label htmlFor="borderColor">Couleur des bords</Label>
          <div className="flex gap-2">
            <Input
              id="borderColor"
              type="color"
              value={customization.borderColor}
              onChange={(e) => handleChange('borderColor', e.target.value)}
              className="w-12 h-10 p-1 rounded cursor-pointer"
            />
            <Input
              type="text"
              value={customization.borderColor}
              onChange={(e) => handleChange('borderColor', e.target.value)}
              placeholder="#e5e7eb"
              className="flex-1"
            />
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <Label htmlFor="borderRadius">Rayon de bordure (px)</Label>
          <Input
            id="borderRadius"
            type="number"
            value={customization.borderRadius.replace('px', '')}
            onChange={(e) => handleChange('borderRadius', `${e.target.value}px`)}
            placeholder="8"
            min="0"
            max="50"
          />
        </div>
      </div>
    </div>
  );
};

export default FaqCustomization;