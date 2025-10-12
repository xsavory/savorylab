import { useState } from "react";
import { useNavigate } from '@tanstack/react-router'
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { BgAnimateButton, Input, Label } from "@repo/react-components/ui";

import useParticipantAuth from "src/hooks/use-participant-auth";

const transition = { type: "spring" as const, bounce: 0, duration: 0.4 };
const closeTransition = { type: "spring" as const, bounce: 0, duration: 0.25 };

const ParticipantRegisterModal = () => {
  const navigate = useNavigate()
  const { register } = useParticipantAuth()

  const [status, setStatus] = useState<string>("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const isOpen = status === "open";
  const isHovered = status === "hovered";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const response = await register(formData.name, formData.phone);

      if (response) {
        navigate({ to: '/participant' });
      }
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        {isOpen || isHovered ? (
          <motion.div
            layoutId="Wrapper"
            style={{ borderRadius: 22 }}
            className="bg-primary tracking-tight text-primary-foreground w-full max-w-[600px]"
            transition={transition}
          >
            <div className="flex w-full items-center justify-between py-2.5 pl-5 pr-2.5">
              <motion.span layoutId="register-text" className="relative font-semibold">
                Masuk
              </motion.span>
              <div className="relative">
                <AnimatePresence>
                  {isHovered && (
                    <motion.p
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="absolute -left-11 top-0.5 text-sm"
                    >
                      Tutup
                    </motion.p>
                  )}
                </AnimatePresence>
                <motion.button
                  layout
                  onClick={() => setStatus("idle")}
                  initial={{ opacity: 0, x: -20, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: -20, y: 10 }}
                  transition={{ ...transition, delay: 0.15 }}
                  whileTap={{
                    scale: 0.9,
                    transition: { ...transition, duration: 0.2 },
                  }}
                  onHoverStart={() => setStatus("hovered")}
                  onHoverEnd={() => setStatus("open")}
                  className="size-6 flex items-center justify-center rounded-full bg-white cursor-pointer"
                >
                  <X className="size-4 text-primary" />
                </motion.button>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isHovered ? { opacity: 1, scale: 0.95 } : { opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-2.5 rounded-[22px] bg-white p-5 border w-full"
            >
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="text-gray-400 font-medium">
                    Nama Lengkap
                  </Label>
                  <Input
                    required
                    id="name"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    disabled={isLoading}
                    className="h-12 text-lg"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone" className="text-gray-400 font-medium">
                    Nomor Handphone
                  </Label>
                  <Input
                    required
                    id="phone"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    disabled={isLoading}
                    className="h-12 text-lg"
                  />
                </div>
                <BgAnimateButton
                  type="submit"
                  gradient="royal-canin"
                  disabled={isLoading}
                  className="w-full h-12 text-lg flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="size-5 animate-spin" />}
                </BgAnimateButton>
              </form>
            </motion.div>
          </motion.div>
        ) : (
          <motion.button
            layoutId="Wrapper"
            onClick={() => setStatus("open")}
            whileTap={{ scale: 0.95 }}
            style={{ borderRadius: 22 }}
            className="w-full max-w-sm flex items-center justify-center gap-1.5 bg-primary text-primary-foreground px-5 py-3 tracking-tight font-semibold cursor-pointer"
            transition={closeTransition}
          >
            <motion.span layoutId="register-text" className="relative" transition={closeTransition}>
              Masuk
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParticipantRegisterModal;
