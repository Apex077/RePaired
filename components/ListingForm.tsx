"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Headphones, Disc, Camera, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const PRODUCT_MOCKS = [
    "AirPods Pro (2nd Gen)",
    "AirPods (3rd Gen)",
    "Sony WF-1000XM5",
    "Samsung Galaxy Buds2 Pro",
    "Google Pixel Buds Pro",
    "Nothing Ear (2)",
];

const CONDITIONS = ["New", "Good", "Fair", "For Parts"];

/**
 * Multi-step form for creating a spare part listing.
 *
 * Steps:
 *  1. Choose item type (Charging Case or Earbud)
 *  2. Select the product model
 *  3. Describe the condition
 *  4. Upload a photo (placeholder — real upload not yet implemented)
 *
 * On submission the form calls POST /api/listings.
 * Location is currently seeded with a placeholder coordinate.
 * TODO: Replace with real geolocation from the browser or a map picker.
 */
export default function ListingForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        type: "", // 'case' | 'bud'
        side: "", // 'left' | 'right' | 'both' (only for buds)
        product: "",
        condition: "",
        image: null as string | null,
    });

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const handleTypeSelect = (type: string) => {
        setFormData({ ...formData, type });
        nextStep();
    };

    const handleProductSelect = (product: string) => {
        setFormData({ ...formData, product });
        nextStep();
    };

    const handleConditionSelect = (condition: string) => {
        setFormData({ ...formData, condition });
        nextStep();
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        // TODO: Replace with real file upload (e.g. to a CDN / presigned URL)
        setFormData({ ...formData, image: "mock-image-url" });
        nextStep();
    }

    const submitForm = async () => {
        try {
            const res = await fetch("/api/listings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: `${formData.condition} ${formData.product}`,
                    type: formData.type,
                    product: formData.product,
                    condition: formData.condition,
                    side: formData.side || null,
                    // TODO: Replace with real coordinates from browser geolocation or a map picker
                    latitude: 51.505,
                    longitude: -0.09,
                }),
            });

            if (res.ok) {
                alert("Listing Created Successfully!");
                // TODO: Redirect to the new listing's page or the user's profile
            } else {
                alert("Failed to create listing.");
            }
        } catch (error) {
            console.error(error);
            alert("Error creating listing.");
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto bg-card rounded-xl shadow-sm border p-6 md:p-8">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Create Listing</h2>
                    <span className="text-sm text-muted-foreground">Step {step} of 4</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300 ease-in-out"
                        style={{ width: `${(step / 4) * 100}%` }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-medium">What are you donating?</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleTypeSelect("case")}
                                className={cn(
                                    "flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all hover:border-primary hover:bg-primary/5",
                                    formData.type === "case"
                                        ? "border-primary bg-primary/5"
                                        : "border-border"
                                )}
                            >
                                <Disc className="w-12 h-12 mb-3 text-primary" />
                                <span className="font-medium">Charging Case</span>
                            </button>
                            <button
                                onClick={() => handleTypeSelect("bud")}
                                className={cn(
                                    "flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all hover:border-primary hover:bg-primary/5",
                                    formData.type === "bud"
                                        ? "border-primary bg-primary/5"
                                        : "border-border"
                                )}
                            >
                                <Headphones className="w-12 h-12 mb-3 text-primary" />
                                <span className="font-medium">Earbud(s)</span>
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-medium">Which product is it?</h3>
                        <Input placeholder="Search for your device..." className="mb-4" />
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {PRODUCT_MOCKS.map((product) => (
                                <button
                                    key={product}
                                    onClick={() => handleProductSelect(product)}
                                    className={cn(
                                        "w-full text-left p-3 rounded-lg transition-colors hover:bg-secondary flex justify-between items-center group",
                                        formData.product === product && "bg-secondary"
                                    )}
                                >
                                    {product}
                                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-muted-foreground" />
                                </button>
                            ))}
                        </div>
                        <Button variant="ghost" onClick={prevStep} className="mt-4">
                            Back
                        </Button>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-medium">What condition is it in?</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {CONDITIONS.map((cond) => (
                                <button
                                    key={cond}
                                    onClick={() => handleConditionSelect(cond)}
                                    className="p-4 border rounded-lg hover:border-primary hover:bg-primary/5 text-left transition-all"
                                >
                                    {cond}
                                </button>
                            ))}
                        </div>
                        <Button variant="ghost" onClick={prevStep}>
                            Back
                        </Button>
                    </motion.div>
                )}

                {step === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <h3 className="text-lg font-medium">Add a photo</h3>
                        <div
                            className="border-2 border-dashed border-input rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-secondary/50 transition-colors"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => {
                                // TODO: Trigger a real <input type="file"> for image upload
                                setFormData({ ...formData, image: "mocked" });
                            }}
                        >
                            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                                <Camera className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                            <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                        </div>

                        {formData.image && (
                            <div className="flex items-center text-green-600 gap-2 justify-center bg-green-50 p-2 rounded-md">
                                <Check className="w-4 h-4" /> Photo uploaded!
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Button variant="ghost" onClick={prevStep} className="flex-1">
                                Back
                            </Button>
                            <Button onClick={submitForm} className="flex-1" disabled={!formData.image}>
                                Create Listing
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
