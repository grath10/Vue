package com.vue.admin.controller;

import com.vue.admin.tools.PdfUtils;
import org.springframework.stereotype.Controller;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

@Controller
@RequestMapping("/report")
public class ReportController {
    public static final String PDF_SUFFIX = ".pdf";

    @RequestMapping("/createPdf")
    @ResponseBody
    public void createChart(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String base64Info = request.getParameter("base64Info");
        String fileName = request.getParameter("fileName");
//        String path = request.getServletContext().getRealPath("/export");
        File exportFile = ResourceUtils.getFile("export");
        String exportPath = exportFile.getAbsolutePath();
        String newFileName = fileName + PDF_SUFFIX;
        PdfUtils.createPdf(base64Info, exportPath + File.separator + newFileName);
        response.setContentType("application/pdf");
        // response.setHeader("Content-Disposition", "attachment;filename=" + URLEncoder.encode(newFileName, "UTF-8"));
        InputStream inputStream = new BufferedInputStream(new FileInputStream(new File(exportPath + File.separator + newFileName)));
        OutputStream outputStream = new BufferedOutputStream(response.getOutputStream());
        copyContent(inputStream, outputStream);
        outputStream.flush();
        inputStream.close();
    }

    @RequestMapping("/export")
    @ResponseBody
    public void exportPdfChart(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String base64Info = request.getParameter("base64Info");
        String params = request.getParameter("params");
        String type = request.getParameter("type");
        PdfUtils.downloadPdf(base64Info, params, type, response);
    }

    private void copyContent(InputStream inputStream, OutputStream outputStream) {
        byte[] bytes = new byte[1024];
        int byteNums = 0;
        try {
            while ((byteNums = inputStream.read(bytes)) != -1) {
                outputStream.write(bytes, 0, byteNums);
            }
            outputStream.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
