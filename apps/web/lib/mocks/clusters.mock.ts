import { Cluster } from "@buildwise/shared";

export const mockClustersByIdea: Record<string, Cluster[]> = {
  "idea-food-waste-2026": [
    {
      id: "cluster-fw-1",
      ideaId: "idea-food-waste-2026",
      type: "existing_solutions",
      summary: "Existing hostel mess management apps rely on manual pre-registration forms (Google Forms/custom portals). They lack real-time plate-waste feedback loops and suffer from low student compliance.",
      sources: [
        {
          title: "Web: Commercial Mess Management & Attendance Systems Overview",
          url: "https://example-mess-portal.org/overview",
          snippet: "Legacy systems record attendance via RFID cards but cannot predict unannounced absenteeism or measure post-meal plate waste.",
          sourceType: "web",
        },
      ],
      __mocked: true,
    },
    {
      id: "cluster-fw-2",
      ideaId: "idea-food-waste-2026",
      type: "academic",
      summary: "IEEE literature highlights IoT smart bins equipped with weight sensors and Computer Vision cameras to automatically quantify food waste volume in institutional cafeterias.",
      sources: [
        {
          title: "IEEE: IoT Smart Bin Sensor Networks for Institutional Food Waste Minimization",
          url: "https://ieeexplore.ieee.org/document/9981204",
          snippet: "Presents an automated waste bin with load cells and ESP32-CAM module achieving 91% accuracy in classifying organic vs non-organic plate leftovers.",
          sourceType: "ieee_xplore",
          meta: {
            doi: "10.1109/JIOT.2023.3298101",
            venue: "IEEE Internet of Things Journal",
            year: 2023,
            authors: ["Dr. S. Kulkarni", "A. Deshmukh", "R. Sharma"],
          },
        },
        {
          title: "IEEE: Deep Learning Based Attendance Forecasting for Campus Catering Services",
          url: "https://ieeexplore.ieee.org/document/10048192",
          snippet: "Applies LSTM neural networks to weather and academic calendar data to forecast hostel mess attendance with sub-5% error rate.",
          sourceType: "ieee_xplore",
          meta: {
            doi: "10.1109/TCSS.2023.3241908",
            venue: "IEEE Transactions on Computational Social Systems",
            year: 2023,
            authors: ["M. Patil", "J. V. Rao"],
          },
        },
      ],
      __mocked: true,
    },
    {
      id: "cluster-fw-3",
      ideaId: "idea-food-waste-2026",
      type: "oss",
      summary: "Open-source projects like SmartBinAI provide PyTorch models for food image classification, but lack unified microservice architectures connecting kitchen prep forecasting with bin sensors.",
      sources: [
        {
          title: "GitHub: SmartBinAI / food-waste-predictor",
          url: "https://github.com/SmartBinAI/food-waste-predictor",
          snippet: "PyTorch & YOLOv8 model for classifying plate waste items and estimating weight via depth camera.",
          sourceType: "github",
          meta: { stars: 890 },
        },
      ],
      __mocked: true,
    },
    {
      id: "cluster-fw-4",
      ideaId: "idea-food-waste-2026",
      type: "gaps",
      summary: "Key Research Gap: No existing system combines hostel mess-count prediction with real-time plate-waste detection into a unified closed-loop kitchen preparation recommendation engine.",
      sources: [
        {
          title: "IEEE Forum: Open Challenges in Campus Sustainability & Waste Analytics",
          url: "https://ieee-tech-forum.org/threads/campus-food-waste-2025",
          snippet: "Highlighting the disconnect between attendance pre-registration and kitchen batch cooking schedules.",
          sourceType: "forum",
        },
      ],
      __mocked: true,
    },
  ],
  "idea-sat-ai-2026": [
    {
      id: "cluster-sat-1",
      ideaId: "idea-sat-ai-2026",
      type: "existing_solutions",
      summary: "Current commercial payloads utilize legacy fixed-bitrate H.265 hardware coders. These incur high power overhead (15W+) and lack dynamic adaptability to radio link fluctuations.",
      sources: [
        {
          title: "NASA JPL: Autonomous Nanosat Flight Software Brief",
          url: "https://www.jpl.nasa.gov/tech-briefs/autonomous-navigation-2024",
          snippet: "Defines onboard processing constraints and packet radio protocols for CubeSat payloads.",
          sourceType: "web",
        },
      ],
      __mocked: true,
    },
    {
      id: "cluster-sat-2",
      ideaId: "idea-sat-ai-2026",
      type: "academic",
      summary: "State-of-the-art IEEE literature highlights sub-vector quantization neural networks and adaptive transformer models optimized for low-power FPGA microcontrollers.",
      sources: [
        {
          title: "IEEE: Real-Time Edge Processing & Deep Compression for Satellite Data Streams",
          url: "https://ieeexplore.ieee.org/document/9845120",
          snippet: "Presents an onboard FPGA-accelerated neural image codec achieving 18:1 compression ratio with sub-50ms latency on low-earth orbit nanosatellites.",
          sourceType: "ieee_xplore",
          meta: {
            doi: "10.1109/TGRS.2022.3190821",
            venue: "IEEE Transactions on Geoscience and Remote Sensing",
            year: 2022,
            authors: ["Dr. Aris Thorne", "Elena Vance", "Marcus Brody"],
          },
        },
      ],
      __mocked: true,
    },
    {
      id: "cluster-sat-3",
      ideaId: "idea-sat-ai-2026",
      type: "oss",
      summary: "Open-source projects like OpenSatelliteML provide solid PyTorch reference pipelines.",
      sources: [
        {
          title: "GitHub: OpenSatelliteML / edge-vision-pipeline",
          url: "https://github.com/OpenSatelliteML/edge-vision-pipeline",
          snippet: "PyTorch & TensorRT edge pipeline.",
          sourceType: "github",
          meta: { stars: 1420 },
        },
      ],
      __mocked: true,
    },
    {
      id: "cluster-sat-4",
      ideaId: "idea-sat-ai-2026",
      type: "gaps",
      summary: "Key Research Gap: Absence of an open-source automated HIL benchmark framework for dynamic model switching.",
      sources: [],
      __mocked: true,
    },
  ],
};
