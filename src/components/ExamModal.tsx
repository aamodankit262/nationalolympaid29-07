import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { postApi } from "@/services/services";
import { APIPATH } from "@/api/urls";
import { useAuthStore } from "@/store/auth/authStore";
import { toast } from "@/hooks/use-toast";
import { validateExamDate } from "@/utils/dateUtils";

interface ExamDateModalProps {
  onDateSelect: (date: string) => void;
  title?: string;
  description?: string;
}

export default function ExamDateModal({ onDateSelect,
  title = "Select Exam Date",
  description = "Choose the date you'd like to appear for the exam"
}: ExamDateModalProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [examDates, setExamDates] = useState<any>([])
  const { token, logout } = useAuthStore()
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getExamDates()
  }, [])
  const generate12HourTimes = () => {
    const times = [];
    const suffix = ["AM", "PM"];
    for (let i = 8; i <= 22; i++) {
      const hour = i % 12 === 0 ? 12 : i % 12;
      const ampm = suffix[Math.floor(i / 12) % 2];
      times.push(`${hour}:00 ${ampm}`);
      // times.push(`${hour}:30 ${ampm}`);
    }
    return times;
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(e.target.value);
  };
  // function to12HourFormat(time: string): string {
  //   const [hour, minute] = time.split(":");
  //   const date = new Date();
  //   date.setHours(parseInt(hour));
  //   date.setMinutes(parseInt(minute));
  //   return date.toLocaleTimeString("en-US", {
  //     hour: "numeric",
  //     minute: "2-digit",
  //     hour12: true,
  //   });
  // }

  const getExamDates = async () => {
    setLoading(true);
    try {
      const resp = await postApi(APIPATH.examdates, {}, token, logout);
      // console.log(resp, 'examDates');
      if (resp.success && Array.isArray(resp.data) && resp.data.length > 0) {
        const dates = resp.data[0].available_dates || [];
        const today = new Date();
        const validDates = dates.filter((date: string) => {
          const [day, month, year] = date.split('/');
          const examDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          return examDate >= today;
        });
        setExamDates(validDates);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to load exam dates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!confirmed && selectedDate && selectedTime) {
      const [year, month, day] = selectedDate.split("-");
      const formattedDate = `${day}-${month}-${year}`; // DD-MM-YYYY
      const formattedTime = selectedTime;
      const validation = validateExamDate(`${day}/${month}/${year}`);
      if (!validation.valid) {
        toast({
          title: "Invalid Date",
          description: validation.message,
          variant: "destructive",
        });
        return;
      }

      const isSure = window.confirm(`You have selected ${formattedDate} at ${formattedTime}. Do you want to confirm this?`);

      if (isSure) {
        try {
          setLoading(true);

          const payload = {
            exam_name: "National Finance Literacy Olympiad",
            exam_date: formattedDate,
            exam_time: formattedTime,
          };

          const resp = await postApi(
            APIPATH.setMailExamDate,
            payload,
            token,
            logout
          );
        
          if (resp.success) {
            toast({
              title: "Exam Date Set",
              description: "Confirmation email has been sent successfully.",
            });
            setConfirmed(true);
            onDateSelect(`${formattedDate} ${selectedTime}`);
          } else {
            toast({
              title: "Failed",
              description: resp.message || "Unable to set exam date.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error(error);
          toast({
            title: "Error",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    }
  };

  

  const handleDateChange = (value: string) => {
    setSelectedDate(value);
    setConfirmed(false);
  };

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Card className="min-w-[100%] max-w-md shadow-2xl border border-gray-200">
        <CardHeader className="text-center bg-indigo-600 text-white rounded-t-lg">
          <div className="flex justify-center mb-4">
            <img
              src="/assets/064e7ad4-4435-40dc-a788-9b0bdfadd03c.png"
              alt="SAFE Academy Logo"
              className="h-12 w-auto group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription className="text-white">{description}</CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label>Select Date</Label>
            <Select value={selectedDate} onValueChange={handleDateChange} disabled={confirmed || loading}>
              <SelectTrigger className="border-gray-300 focus:border-green-500">
                <SelectValue placeholder={loading ? "Loading dates..." : "Select a date"} />
              </SelectTrigger>
              <SelectContent>
                {examDates?.map((date: string) => {
                  const [day, month, year] = date.split('/');
                  const iso = `${year}-${month}-${day}`;
                  return (
                    <SelectItem key={iso} value={iso}>
                      {new Date(iso).toLocaleDateString("en-IN", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {examDates.length === 0 && !loading && (
              <p className="text-sm text-gray-500 mt-2">No available exam dates at the moment.</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="dropdown-time" className="block text-sm font-medium text-gray-700">
              Select Exam Time 
            </label>
            <select
              id="dropdown-time"
              value={selectedTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">-- Select Time --</option>
              {generate12HourTimes().map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {selectedTime && (
              <p className="text-xs text-gray-600">Selected Time: {selectedTime}</p>
            )}
          </div>


          <Button
            className="w-full bg-indigo-600 hover:bg-slate-700 text-white"
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedTime || confirmed || loading}
          >
            {loading ? "Loading..." : confirmed ? "Date Confirmed" : "Confirm Date"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
