import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DeleteConfirmationModal } from '@/components/ui/delete-confirmation-modal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown, ChevronUp, Copy, Edit, Plus, Trash2, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface SmartArrayCRUDProps {
    title: string;
    data: any[];
    onSave: (newData: any[]) => void;
    onClose: () => void;
}

export const SmartArrayCRUD: React.FC<SmartArrayCRUDProps> = ({
    title,
    data,
    onSave,
    onClose
}) => {
    const [items, setItems] = useState<any[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; index: number | null }>({
        isOpen: false,
        index: null
    });

    // Initialize items from data
    useEffect(() => {
        if (Array.isArray(data)) {
            setItems([...data]);
        } else {
            setItems([]);
        }
    }, [data]);

    // Auto-detect structure from first item or create a basic template
    const getItemStructure = () => {
        if (items.length === 0) {
            // Return a basic template for new arrays
            return {
                title: '',
                description: '',
                tailwindCss: '',
                customCss: {}
            };
        }
        return items[0];
    };

    // Create new item based on first item structure
    const createNewItem = () => {
        const template = getItemStructure();
        const newItem: any = {};

        Object.entries(template).forEach(([key, value]: [string, any]) => {
            if (key === 'tailwindCss') {
                newItem[key] = ''; // Empty Tailwind classes
            } else if (key === 'customCss') {
                newItem[key] = {}; // Empty CSS object
            } else if (typeof value === 'string') {
                newItem[key] = ''; // Empty string for text
            } else if (typeof value === 'boolean') {
                newItem[key] = false; // Default boolean
            } else if (typeof value === 'number') {
                newItem[key] = 0; // Default number
            } else if (Array.isArray(value)) {
                newItem[key] = []; // Empty array
            } else if (typeof value === 'object' && value !== null) {
                newItem[key] = {}; // Empty object
            } else {
                newItem[key] = value; // Keep other types as-is
            }
        });

        return newItem;
    };

    // CRUD Operations
    const handleCreate = () => {
        const newItem = createNewItem();
        const newItems = [...items, newItem];
        setItems(newItems);
        setEditingIndex(items.length); // Edit the new item immediately
    };

    const handleDuplicate = (index: number) => {
        const duplicatedItem = { ...items[index] };
        const newItems = [...items];
        newItems.splice(index + 1, 0, duplicatedItem);
        setItems(newItems);
    };

    const handleDelete = (index: number) => {
        setDeleteModal({ isOpen: true, index });
    };

    const confirmDelete = () => {
        if (deleteModal.index !== null) {
            const newItems = items.filter((_, i) => i !== deleteModal.index);
            setItems(newItems);
            if (editingIndex === deleteModal.index) {
                setEditingIndex(null);
            } else if (editingIndex !== null && editingIndex > deleteModal.index) {
                setEditingIndex(editingIndex - 1);
            }
        }
        setDeleteModal({ isOpen: false, index: null });
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newItems = [...items];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex >= 0 && targetIndex < items.length) {
            [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
            setItems(newItems);

            // Update editing index if needed
            if (editingIndex === index) {
                setEditingIndex(targetIndex);
            } else if (editingIndex === targetIndex) {
                setEditingIndex(index);
            }
        }
    };

    const handleSaveAll = () => {
        // Close editing mode first
        setEditingIndex(null);
        // Save the items
        onSave(items);
        onClose();
    };

    // Get preview text for an item
    const getItemPreview = (item: any) => {
        if (!item || typeof item !== 'object') {
            return String(item) || 'Empty Item';
        }

        const keys = Object.keys(item).filter(key =>
            key !== 'tailwindCss' && key !== 'customCss' &&
            typeof item[key] === 'string' && item[key].trim() !== ''
        );

        // Priority order for preview text
        const priorityKeys = ['title', 'name', 'label', 'text', 'heading'];
        const previewKey = priorityKeys.find(key => keys.includes(key)) || keys[0];

        if (previewKey && item[previewKey]) {
            return String(item[previewKey]).slice(0, 50) + (item[previewKey].length > 50 ? '...' : '');
        }

        return 'Untitled Item';
    };

    return (
        <>
            <Dialog open={true} onOpenChange={onClose}>
                <DialogContent className="max-w-6xl max-h-[90vh] bg-[#1c1c1c] border-gray-700 text-white overflow-hidden flex flex-col">
                    {/* Header */}
                    <DialogHeader className="pb-4 border-b border-gray-700">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-white text-xl">
                                {title} ({items.length} items)
                            </DialogTitle>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={handleCreate}
                                    className="bg-black hover:bg-black/30 text-white"
                                    size="sm"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Item
                                </Button>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Items List */}
                    <div className="flex-1 overflow-y-auto pr-2 py-4">
                        <div className="space-y-4">
                            {items.map((item, index) => (
                                <Card key={index} className="bg-[#272725] border-gray-600 hover:border-gray-500 transition-colors">
                                    <CardContent className="p-3">
                                        {editingIndex === index ? (
                                            // Edit Mode
                                            <ItemEditor
                                                item={item}
                                                onChange={(updatedItem) => {
                                                    const newItems = [...items];
                                                    newItems[index] = updatedItem;
                                                    setItems(newItems);
                                                }}
                                                onSave={() => setEditingIndex(null)}
                                                onCancel={() => setEditingIndex(null)}
                                            />
                                        ) : (
                                            // View Mode
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-semibold text-white mb-2 text-lg">
                                                        {getItemPreview(item)}
                                                    </div>
                                                    <div className="text-sm text-gray-400 space-y-1">
                                                        {typeof item === 'object' && item !== null ?
                                                            Object.entries(item)
                                                                .filter(([key, value]) =>
                                                                    key !== 'tailwindCss' &&
                                                                    key !== 'customCss' &&
                                                                    typeof value === 'string' &&
                                                                    String(value).length > 0
                                                                )
                                                                .slice(0, 2)
                                                                .map(([key, value]) => (
                                                                    <div key={key} className="flex">
                                                                        <span className="font-medium text-gray-300 capitalize w-20 flex-shrink-0">
                                                                            {key}:
                                                                        </span>
                                                                        <span className="text-gray-400 truncate">
                                                                            {String(value).slice(0, 50)}{String(value).length > 50 ? '...' : ''}
                                                                        </span>
                                                                    </div>
                                                                ))
                                                            : String(item)
                                                        }
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleMove(index, 'up')}
                                                        disabled={index === 0}
                                                        className="text-gray-400 hover:text-white hover:bg-[#1c1c1c] disabled:opacity-30 h-8 w-8 p-0"
                                                        title="Move up"
                                                    >
                                                        <ChevronUp className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleMove(index, 'down')}
                                                        disabled={index === items.length - 1}
                                                        className="text-gray-400 hover:text-white hover:bg-[#1c1c1c] disabled:opacity-30 h-8 w-8 p-0"
                                                        title="Move down"
                                                    >
                                                        <ChevronDown className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDuplicate(index)}
                                                        className="text-green-400 hover:text-green-300 hover:bg-green-900/20 h-8 w-8 p-0"
                                                        title="Duplicate"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setEditingIndex(index)}
                                                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 h-8 w-8 p-0"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(index)}
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-8 w-8 p-0"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}

                            {items.length === 0 && (
                                <Card className="bg-[#272725] border-gray-600 border-dashed">
                                    <CardContent className="text-center py-16">
                                        <div className="text-gray-400 mb-4">
                                            <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        </div>
                                        <p className="text-lg mb-2 text-gray-300">No items yet</p>
                                        <p className="text-sm text-gray-400 mb-4">
                                            Click "Add Item" to create your first item
                                        </p>
                                        <Button
                                            onClick={handleCreate}
                                            className="bg-black hover:bg-black/30 text-white"
                                            size="sm"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add First Item
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <Separator className="bg-gray-600" />
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            onClick={onClose}
                            className="border-gray-600 text-white bg-[#272725] hover:bg-[#272725]"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveAll}
                            className="bg-black hover:bg-black/30 text-white"
                        >
                            Save Changes ({items.length} items)
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, index: null })}
                onConfirm={confirmDelete}
                title="Delete this item?"
                description="This action cannot be undone. The item will be permanently removed from the array."
            />
        </>
    );
};

// Enhanced Item Editor with better layout
const ItemEditor: React.FC<{
    item: any;
    onChange: (item: any) => void;
    onSave: () => void;
    onCancel: () => void;
}> = ({ item, onChange, onSave, onCancel }) => {

    const handleFieldChange = (key: string, value: any) => {
        onChange({ ...item, [key]: value });
    };

    const renderField = (key: string, value: any) => {
        // Style fields get special treatment
        if (key === 'tailwindCss') {
            return (
                <div key={key} className="space-y-2">
                    <Label className="text-white font-medium capitalize text-sm">Tailwind Classes</Label>
                    <Input
                        value={value || ''}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                        className="bg-[#1c1c1c] border-gray-600 text-white placeholder:text-gray-400"
                        placeholder="text-lg font-bold bg-blue-500"
                    />
                </div>
            );
        }

        if (key === 'customCss') {
            return (
                <div key={key} className="space-y-2">
                    <Label className="text-white font-medium capitalize text-sm">Custom CSS (JSON)</Label>
                    <Textarea
                        value={JSON.stringify(value || {}, null, 2)}
                        onChange={(e) => {
                            try {
                                const parsed = JSON.parse(e.target.value);
                                handleFieldChange(key, parsed);
                            } catch (err) {
                                // Invalid JSON, keep the current value
                                console.warn('Invalid JSON input');
                            }
                        }}
                        className="bg-[#1c1c1c] border-gray-600 text-white placeholder:text-gray-400 font-mono text-sm"
                        rows={3}
                        placeholder='{"color": "#ff0000"}'
                    />
                </div>
            );
        }

        // Auto-detect field type based on value and key name
        if (typeof value === 'boolean') {
            return (
                <div key={key} className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id={key}
                            checked={value}
                            onCheckedChange={(checked) => handleFieldChange(key, checked)}
                            className="border-gray-600"
                        />
                        <Label htmlFor={key} className="text-white capitalize">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Label>
                    </div>
                </div>
            );
        }

        if (typeof value === 'number') {
            return (
                <div key={key} className="space-y-2">
                    <Label className="text-white font-medium capitalize text-sm">
                        {key.replace(/([A-Z])/g, ' $1')}
                    </Label>
                    <Input
                        type="number"
                        value={value}
                        onChange={(e) => handleFieldChange(key, parseFloat(e.target.value) || 0)}
                        className="bg-[#1c1c1c] border-gray-600 text-white placeholder:text-gray-400"
                    />
                </div>
            );
        }

        if (Array.isArray(value)) {
            return (
                <div key={key} className="space-y-2">
                    <Label className="text-white font-medium capitalize text-sm">
                        {key.replace(/([A-Z])/g, ' $1')} (Array)
                    </Label>
                    <Textarea
                        value={value.join('\n')}
                        onChange={(e) => handleFieldChange(key, e.target.value.split('\n').filter(item => item.trim()))}
                        className="bg-[#1c1c1c] border-gray-600 text-white placeholder:text-gray-400"
                        rows={3}
                        placeholder="One item per line"
                    />
                </div>
            );
        }

        // Handle object types (excluding null)
        if (typeof value === 'object' && value !== null) {
            return (
                <div key={key} className="space-y-2">
                    <Label className="text-white font-medium capitalize text-sm">
                        {key.replace(/([A-Z])/g, ' $1')} (Object)
                    </Label>
                    <Textarea
                        value={JSON.stringify(value, null, 2)}
                        onChange={(e) => {
                            try {
                                const parsed = JSON.parse(e.target.value);
                                handleFieldChange(key, parsed);
                            } catch (err) {
                                console.warn('Invalid JSON input');
                            }
                        }}
                        className="bg-[#1c1c1c] border-gray-600 text-white placeholder:text-gray-400 font-mono text-sm"
                        rows={3}
                        placeholder='{}'
                    />
                </div>
            );
        }

        // Text fields with smart detection
        const isUrl = key.toLowerCase().includes('url') || key.toLowerCase().includes('href') || key.toLowerCase().includes('link');
        const isEmail = key.toLowerCase().includes('email');
        const isLongText = key.toLowerCase().includes('description') || key.toLowerCase().includes('content') || key.toLowerCase().includes('bio');

        if (isLongText) {
            return (
                <div key={key} className="space-y-2">
                    <Label className="text-white font-medium capitalize text-sm">
                        {key.replace(/([A-Z])/g, ' $1')}
                    </Label>
                    <Textarea
                        value={value || ''}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                        className="bg-[#1c1c1c] border-gray-600 text-white placeholder:text-gray-400"
                        rows={3}
                    />
                </div>
            );
        }

        return (
            <div key={key} className="space-y-2">
                <Label className="text-white font-medium capitalize text-sm">
                    {key.replace(/([A-Z])/g, ' $1')}
                </Label>
                <Input
                    type={isUrl ? 'url' : isEmail ? 'email' : 'text'}
                    value={value || ''}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                    className="bg-[#1c1c1c] border-gray-600 text-white placeholder:text-gray-400"
                    placeholder={isUrl ? 'https://example.com' : isEmail ? 'email@example.com' : ''}
                />
            </div>
        );
    };

    return (
        <div className="bg-[#1a1a1a] rounded-lg p-5">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold text-white">Edit Item</h4>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCancel}
                    className="text-gray-400 hover:text-white h-8 w-8 p-0"
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {Object.entries(item).map(([key, value]) => renderField(key, value))}
            </div>

            <Separator className="bg-gray-600 mb-6" />
            <div className="flex justify-end gap-3">
                <Button
                    size="sm"
                    onClick={onCancel}
                    className="border-gray-600 text-white bg-[#272725] hover:bg-[#272725]"
                >
                    Cancel
                </Button>
                <Button
                    size="sm"
                    onClick={onSave}
                    className="bg-black hover:bg-black/30 text-white"
                >
                    Save Changes
                </Button>
            </div>
        </div>
    );
};
