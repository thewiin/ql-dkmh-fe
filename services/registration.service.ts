import PaymentService from "./payment.service";
import { TuitionValidationResult } from "../types";

const RegistrationService = {
  validateTuition: async (): Promise<TuitionValidationResult> => {
    const tuition = await PaymentService.getTuitionStatus();

    return {
      canRegister: !tuition.isBlocked,
      status: tuition.status,
      message: tuition.message,
    };
  },
};

export default RegistrationService;
